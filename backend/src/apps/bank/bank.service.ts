import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { isValid, subDays, parseISO, subMonths } from 'date-fns';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { InstitutionDto, BankAccountDto, InitiateBankConnectionResponseDto } from './dto';
import { BankTransactionDto } from './dto/prisma-bank-transaction.dto';
import { TransactionStatsDto } from './dto/transactions-stats.dto';
import { YapilyService } from './yapily/yapily.service';

@Injectable()
export class BankService {
    constructor(
        @InjectPinoLogger(BankService.name)
        private readonly logger: PinoLogger,
        private readonly prisma: PrismaService,
        private readonly yapily: YapilyService,
        @InjectQueue('bank-sync') private readonly syncQueue: Queue
    ) {}

    async listInstitutions(): Promise<InstitutionDto[]> {
        try {
            return await this.yapily.listInstitutions();
        } catch (err) {
            this.logger.error('Failed to list institutions', err.stack);
            throw new InternalServerErrorException('Could not fetch institutions');
        }
    }

    async createAccountAuthRequest(
        applicationUserId: string,
        institutionId: string,
        clientCallbackUrl: string,
        serverCallbackUrl: string
    ): Promise<InitiateBankConnectionResponseDto> {
        try {
            const res = await this.yapily.createAccountAuthRequest(
                applicationUserId,
                institutionId,
                clientCallbackUrl,
                serverCallbackUrl
            );
            if (!res.authorisationUrl) {
                this.logger.error('Missing authorization URL in response', JSON.stringify(res));
                throw new InternalServerErrorException('Missing authorization URL');
            }

            await this.prisma.bankConsent.upsert({
                where: {
                    userId_institutionId: {
                        userId: applicationUserId,
                        institutionId,
                    },
                },
                update: {
                    featureScope: res.featureScope ?? [],
                    status: res.status ?? 'AWAITING_AUTHORIZATION',
                    updatedAt: new Date(),
                },
                create: {
                    userId: applicationUserId,
                    institutionId,
                    status: res.status ?? 'AWAITING_AUTHORIZATION',
                    yapilyUserId: res.userUuid,
                    consentToken: null,
                    featureScope: res.featureScope ?? [],
                },
            });

            return {
                url: res.authorisationUrl,
                qrCodeUrl: res.qrCodeUrl,
            };
        } catch (err) {
            this.logger.error('Error creating account auth request', err.stack);
            throw new InternalServerErrorException(err.message);
        }
    }

    async handleCallback(
        consentToken: string,
        userId: string,
        userUuid: string,
        institutionId: string
    ): Promise<void> {
        try {
            const remoteAccounts = await this.yapily.getAccounts(consentToken);
            const accountIdMap = new Map<string, string>(); // <remoteAccId, localAccId>
            // Update consent, create accounts, and update identifications in a transaction
            await this.prisma.$transaction(async (tx) => {
                const consent = await tx.bankConsent.upsert({
                    where: { userId_institutionId: { userId, institutionId } },
                    update: { consentToken, status: 'AUTHORIZED', updatedAt: new Date() },
                    create: {
                        userId,
                        institutionId,
                        consentToken,
                        status: 'AUTHORIZED',
                        yapilyUserId: userUuid,
                    },
                });

                for (const acc of remoteAccounts) {
                    const name = acc.accountNames?.[0]?.name ?? acc.nickname ?? 'Unnamed';
                    const savedAcc = await tx.bankAccount.upsert({
                        where: { userId_accountId: { userId, accountId: acc.id } },
                        update: {
                            institutionId,
                            name,
                            accountType: acc.accountType,
                            usageType: acc.usageType,
                            balance: acc.balance,
                            currency: acc.currency,
                            meta: acc as any,
                            bankConsentId: consent.id,
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
                            bankConsentId: consent.id,
                        },
                    });

                    // Update all identifications for this account
                    await tx.bankAccountIdentification.deleteMany({
                        where: { bankAccountId: savedAcc.id },
                    });
                    if (acc.accountIdentifications?.length) {
                        await tx.bankAccountIdentification.createMany({
                            data: acc.accountIdentifications.map((i) => ({
                                bankAccountId: savedAcc.id,
                                type: i.type,
                                identification: i.identification,
                            })),
                        });
                    }
                    accountIdMap.set(acc.id, savedAcc.id);
                }
            });

            // Enqueue sync jobs
            for (const [remoteAccId, localAccId] of accountIdMap) {
                this.syncQueue.add('sync-account', {
                    bankAccountId: localAccId,
                    remoteAccountId: remoteAccId,
                    consentToken,
                    userId,
                });
            }
        } catch (error) {
            this.logger.error('Callback sync failed', error.stack);
            throw new InternalServerErrorException('Error processing bank callback');
        }
    }

    async getAccounts(userId: string): Promise<BankAccountDto[]> {
        try {
            const rows = await this.prisma.bankAccount.findMany({
                where: { userId },
                include: { bankAccountIdentification: true },
            });

            return rows;
        } catch (err) {
            this.logger.error('Failed to get accounts', err.stack);
            throw new InternalServerErrorException('Could not retrieve accounts');
        }
    }

    async getTransactions(userId: string, accountId: string) {
        const account = await this.prisma.bankAccount.findUnique({
            where: { userId_accountId: { userId, accountId } },
            include: {
                consent: { select: { consentToken: true } },
            },
        });
        if (!account || !account.consent?.consentToken) {
            throw new NotFoundException('Account not found or not authorized');
        }

        try {
            return await this.yapily.getTransactions(accountId, account.consent.consentToken);
        } catch (err) {
            this.logger.error(`Failed fetching transactions for ${accountId}`, err.stack);
            throw new InternalServerErrorException('Could not retrieve transactions');
        }
    }

    async getStoredTransactions(
        userId: string,
        accountId: string,
        options: {
            sort?: 'date' | '-date';
            offset?: number;
            limit?: number;
            before?: Date;
            from?: Date;
        }
    ): Promise<BankTransactionDto[]> {
        const account = await this.prisma.bankAccount.findUnique({
            where: { userId_accountId: { userId, accountId } },
        });

        if (!account) {
            throw new NotFoundException('Bank account not found');
        }

        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (options.from) dateFilter.gte = options.from;
        if (options.before) dateFilter.lte = options.before;

        const sortOrder = options.sort === 'date' ? 'asc' : 'desc';

        const res = await this.prisma.bankTransaction.findMany({
            where: {
                bankAccountId: account.id,
                ...(options.from || options.before ? { date: dateFilter } : {}),
            },
            orderBy: {
                date: sortOrder,
            },
            skip: options.offset ?? 0,
            take: options.limit ?? 50,
        });

        return res as BankTransactionDto[];
    }

    async getAllStoredTransactions(
        userId: string,
        options: {
            sort?: 'date' | '-date';
            offset?: number;
            limit?: number;
            before?: Date;
            from?: Date;
        }
    ): Promise<{ data: BankTransactionDto[]; total: number }> {
        const userAccounts = await this.prisma.bankAccount.findMany({
            where: { userId },
            select: { id: true },
        });

        if (userAccounts.length === 0) {
            return { data: [], total: 0 };
        }

        const bankAccountIds = userAccounts.map((acc) => acc.id);

        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (options.from) dateFilter.gte = options.from;
        if (options.before) dateFilter.lte = options.before;

        const sortOrder = options.sort === 'date' ? 'asc' : 'desc';

        const [data, total] = await this.prisma.$transaction([
            this.prisma.bankTransaction.findMany({
                where: {
                    bankAccountId: { in: bankAccountIds },
                    ...(options.from || options.before ? { date: dateFilter } : {}),
                },
                orderBy: {
                    date: sortOrder,
                },
                skip: options.offset ?? 0,
                take: options.limit ?? 50,
            }),
            this.prisma.bankTransaction.count({
                where: {
                    bankAccountId: { in: bankAccountIds },
                    ...(options.from || options.before ? { date: dateFilter } : {}),
                },
            }),
        ]);

        return { data, total } as { data: BankTransactionDto[]; total: number };
    }

    async getWeeklyStats(
        userId: string,
        startDate?: string,
        endDate?: string
    ): Promise<TransactionStatsDto[]> {
        const start = startDate ? parseISO(startDate) : subDays(new Date(), 84); // last 12 weeks
        const end = endDate ? parseISO(endDate) : new Date();

        if (!isValid(start) || !isValid(end)) {
            throw new InternalServerErrorException('Invalid date format');
        }

        try {
            const accountIds = await this.prisma.bankAccount.findMany({
                where: { userId },
                select: { id: true },
            });

            const ids = accountIds.map((a) => a.id);
            if (ids.length === 0) return [];

            const rows = await this.prisma.bankTransaction.groupBy({
                by: ['weekStart', 'direction'],
                where: {
                    bankAccountId: { in: ids },
                    weekStart: {
                        gte: start,
                        lte: end,
                    },
                },
                _sum: { amount: true },
                orderBy: { weekStart: 'asc' },
            });

            return rows.map((r) => ({
                periodStart: r.weekStart!,
                direction: r.direction,
                total: r._sum.amount ?? 0,
            }));
        } catch (err) {
            this.logger.error('Failed to fetch weekly stats', err.stack);
            throw new InternalServerErrorException('Failed to fetch weekly stats');
        }
    }

    async getMonthlyStats(
        userId: string,
        startDate?: string,
        endDate?: string
    ): Promise<TransactionStatsDto[]> {
        const start = startDate ? parseISO(startDate) : subMonths(new Date(), 12); // last 12 months
        const end = endDate ? parseISO(endDate) : new Date();

        if (!isValid(start) || !isValid(end)) {
            throw new InternalServerErrorException('Invalid date format');
        }

        try {
            const accountIds = await this.prisma.bankAccount.findMany({
                where: { userId },
                select: { id: true },
            });

            const ids = accountIds.map((a) => a.id);
            if (ids.length === 0) return [];

            const rows = await this.prisma.bankTransaction.groupBy({
                by: ['monthStart', 'direction'],
                where: {
                    bankAccountId: { in: ids },
                    monthStart: {
                        gte: start,
                        lte: end,
                    },
                },
                _sum: { amount: true },
                orderBy: { monthStart: 'asc' },
            });

            return rows.map((r) => ({
                periodStart: r.monthStart!,
                direction: r.direction,
                total: r._sum.amount ?? 0,
            }));
        } catch (err) {
            this.logger.error('Failed to fetch monthly stats', err.stack);
            throw new InternalServerErrorException('Failed to fetch monthly stats');
        }
    }
}
