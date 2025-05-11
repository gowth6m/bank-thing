import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { subDays, startOfWeek, startOfMonth } from 'date-fns';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDirection } from '@prisma/client';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { YapilyService } from './yapily/yapily.service';
import { EventService } from '../event/event.service';

const CONCURRENCY = 5;
const SYNC_ACCOUNT_JOB_NAME = 'sync-account';
const SYNC_ACCOUNT_QUEUE_NAME = 'bank-sync';
const TRANSACTION_LIMIT = 500;
const TRANSACTION_DAYS = 120;

interface SyncAccountJob {
    bankAccountId: string;
    remoteAccountId: string;
    consentToken: string;
    userId: string;
}

@Processor(SYNC_ACCOUNT_QUEUE_NAME)
@Injectable()
export class BankProcessor {
    constructor(
        private readonly prisma: PrismaService,
        private readonly yapily: YapilyService,
        @InjectPinoLogger(BankProcessor.name)
        private readonly logger: PinoLogger,
        private readonly syncEvents: EventService
    ) {}

    @Process({ name: SYNC_ACCOUNT_JOB_NAME, concurrency: CONCURRENCY })
    async handleSyncAccount(job: Job<SyncAccountJob>): Promise<void> {
        const { bankAccountId, remoteAccountId, consentToken, userId } = job.data;
        this.logger.debug(`Starting sync for Yapily account ${remoteAccountId}`);

        try {
            const fromDate = subDays(new Date(), TRANSACTION_DAYS).toISOString();
            const transactions = await this.yapily.getTransactions(remoteAccountId, consentToken, {
                from: fromDate,
                limit: TRANSACTION_LIMIT,
            });

            if (!transactions.length) {
                this.logger.debug(`No new transactions for ${remoteAccountId}`);
                return;
            }

            const data: any = transactions
                .map((tx) => {
                    // skip invalid entries
                    if (!tx.id) {
                        this.logger.warn(`Transaction has no ID, skipping`, tx);
                        return null;
                    }
                    if (!tx.amount || !tx.currency) {
                        this.logger.warn(
                            `Transaction ${tx.id} has no amount or currency, skipping`
                        );
                        return null;
                    }
                    if (!tx.date || isNaN(new Date(tx.date).getTime())) {
                        this.logger.warn(
                            `Transaction ${tx.id} has invalid date, skipping`,
                            tx.date
                        );
                        return null;
                    }

                    const txDate = new Date(tx.date);

                    return {
                        bankAccountId,
                        transactionId: tx.id,
                        date: txDate,
                        status: tx.status,
                        amount: tx.amount,
                        currency: tx.currency,
                        direction:
                            tx.amount < 0 ? TransactionDirection.OUT : TransactionDirection.IN,
                        reference: tx.reference,
                        description: tx.description,
                        balanceAmount: tx.balance?.balanceAmount?.amount ?? null,
                        balanceCurrency: tx.balance?.balanceAmount?.currency ?? null,
                        payeeDetails: tx.payeeDetails ?? {},
                        payerDetails: tx.payerDetails ?? {},
                        weekStart: startOfWeek(txDate, { weekStartsOn: 1 }),
                        monthStart: startOfMonth(txDate),
                        meta: tx,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                })
                .filter(Boolean);

            // guard against empty insert
            if (data.length === 0) {
                this.logger.debug(
                    `No valid transactions to insert for ${remoteAccountId} — all ${transactions.length} rows were filtered out.`
                );
                return;
            }

            await this.prisma.bankTransaction.createMany({
                data,
                skipDuplicates: true,
            });

            this.logger.debug(`Inserted ${data.length} transactions for ${remoteAccountId}`);

            this.syncEvents.emit(userId, 'transactions-updated', {
                bankAccountId,
                remoteAccountId,
            });
        } catch (error) {
            this.logger.error(`Failed syncing account ${remoteAccountId}`, error.stack);
            throw new InternalServerErrorException('Bank transaction sync failed');
        }
    }
}
