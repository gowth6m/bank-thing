import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { YapilyService } from './yapily/yapily.service';

@Injectable()
export class BankCronService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly yapily: YapilyService,
        @InjectQueue('bank-sync') private readonly syncQueue: Queue,
        @InjectPinoLogger(BankCronService.name)
        private readonly logger: PinoLogger
    ) {}

    /**
     * Every hour, refresh all bank accounts:
     * - Fetch all authorised consents
     * - Refresh account list for each consent (upserting into Prisma)
     * - Enqueue a 'sync-account' job for each account to pull the last 1 days of txns
     */
    @Cron(CronExpression.EVERY_6_HOURS, { timeZone: 'Europe/London' })
    async handleDailyRefresh() {
        this.logger.info('Starting daily bank refresh…');

        const consents = await this.prisma.bankConsent.findMany({
            where: { status: 'AUTHORIZED' },
            select: { userId: true, institutionId: true, consentToken: true },
        });

        for (const { userId, institutionId, consentToken } of consents) {
            try {
                if (!consentToken) {
                    this.logger.warn(
                        `No consent token for user ${userId}, institution ${institutionId}. Skipping...`
                    );
                    continue;
                }
                this.logger.info(
                    `Refreshing accounts for user ${userId}, institution ${institutionId}...`
                );

                // 2) fetch remote accounts
                const remoteAccounts = await this.yapily.getAccounts(consentToken);

                // 3) upsert each account into your DB (reuse logic from handleCallback)
                await this.prisma.$transaction(async (tx) => {
                    const consentRecord = await tx.bankConsent.findUniqueOrThrow({
                        where: { userId_institutionId: { userId, institutionId } },
                    });

                    for (const acc of remoteAccounts) {
                        const name = acc.accountNames?.[0]?.name ?? acc.nickname ?? 'Unnamed';
                        await tx.bankAccount.upsert({
                            where: {
                                userId_accountId: { userId, accountId: acc.id },
                            },
                            update: {
                                name,
                                accountType: acc.accountType,
                                usageType: acc.usageType,
                                balance: acc.balance,
                                currency: acc.currency,
                                meta: acc as any,
                                bankConsentId: consentRecord.id,
                                updatedAt: new Date(),
                            },
                            create: {
                                userId,
                                accountId: acc.id,
                                institutionId,
                                name,
                                accountType: acc.accountType,
                                usageType: acc.usageType,
                                balance: acc.balance,
                                currency: acc.currency,
                                meta: acc as any,
                                bankConsentId: consentRecord.id,
                            },
                        });

                        // TODO: Off for now to avoid overloading the server
                        // enqueue a job to sync transactions for this account
                        // await this.syncQueue.add(
                        //     'sync-account',
                        //     {
                        //         bankAccountId: saved.id,
                        //         remoteAccountId: acc.id,
                        //         consentToken,
                        //         userId,
                        //     },
                        //     {
                        //         attempts: 3,
                        //         backoff: { type: 'exponential', delay: 1000 },
                        //     },
                        // );
                    }
                });
            } catch (err) {
                this.logger.error(
                    `Failed to refresh for user ${userId}, institution ${institutionId}: ${err.message}`
                );
            }
        }

        this.logger.info('Daily bank refresh complete.');
    }
}
