import {
    Get,
    Req,
    Post,
    Body,
    Query,
    Param,
    Redirect,
    UseGuards,
    Controller,
    BadRequestException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBody,
    ApiQuery,
    ApiResponse,
    ApiOperation,
    ApiBearerAuth,
} from '@nestjs/swagger';

import {
    BankAccountDto,
    InstitutionDto,
    InitiateBankConnectionRequestDto,
    InitiateBankConnectionResponseDto,
} from './dto';
import { BankTransactionDto, BankTransactionsResponseDto } from './dto/prisma-bank-transaction.dto';
import { TransactionStatsDto } from './dto/transactions-stats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthenticatedRequest } from '../auth/dto';
import { BankService } from './bank.service';

@Controller('bank')
@ApiTags('Bank')
export class BankController {
    constructor(private readonly bankService: BankService) {}

    @ApiOperation({ summary: 'List Yapily institutions' })
    @ApiResponse({ status: 200, type: [InstitutionDto] })
    @UseGuards(JwtAuthGuard)
    @Get('institutions')
    @ApiBearerAuth()
    async listInstitutions(): Promise<InstitutionDto[]> {
        return this.bankService.listInstitutions();
    }

    @ApiResponse({
        status: 200,
        description: 'Current user retrieved successfully',
        type: InitiateBankConnectionResponseDto,
    })
    @ApiBody({
        description: 'Request body containing institutionId and callbackUrl',
        type: InitiateBankConnectionRequestDto,
    })
    @ApiOperation({ summary: 'Initiate Yapily account authorisation flow' })
    @UseGuards(JwtAuthGuard)
    @Post('connect')
    @ApiBearerAuth()
    async connectBank(
        @Req() req: AuthenticatedRequest,
        @Body() body: InitiateBankConnectionRequestDto
    ) {
        const host = req.get('host');
        const protocol = req.protocol;
        const serverCallbackUrl = `${protocol}://${host}/v1/bank/callback`;

        return this.bankService.createAccountAuthRequest(
            req.user.sub,
            body.institutionId,
            body.callbackUrl,
            serverCallbackUrl
        );
    }

    @ApiQuery({
        name: 'client-callback',
        required: true,
        description: 'Client-side redirect URL',
    })
    @ApiQuery({
        name: 'application-user-id',
        required: true,
        description: 'Your app user ID',
    })
    @ApiQuery({
        name: 'consent',
        required: true,
        description: 'Consent token from Yapily',
    })
    @ApiQuery({
        name: 'institution',
        required: true,
        description: 'Yapily institution ID',
    })
    @ApiQuery({
        name: 'user-uuid',
        required: true,
        description: 'Yapily user UUID',
    })
    @ApiOperation({ summary: 'Yapily redirect callback handler' })
    @Get('callback')
    @Redirect()
    async handleCallback(
        @Query('consent') consent: string,
        @Query('application-user-id') applicationUserId: string,
        @Query('user-uuid') yapilyUserId: string,
        @Query('institution') institutionId: string,
        @Query('client-callback') clientCallbackUrl: string
    ) {
        await this.bankService.handleCallback(
            consent,
            applicationUserId,
            yapilyUserId,
            institutionId
        );
        return {
            url: clientCallbackUrl,
        };
    }

    @ApiOperation({ summary: 'Get connected bank accounts for the current user' })
    @ApiResponse({ status: 200, type: [BankAccountDto] })
    @UseGuards(JwtAuthGuard)
    @Get('account/all')
    @ApiBearerAuth()
    async getAccounts(@Req() req: AuthenticatedRequest) {
        return this.bankService.getAccounts(req.user.sub);
    }

    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['date', '-date'],
        description: "Sort by 'date' (asc) or '-date' (desc). Default is '-date'",
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Max number of records (1–1000)',
        type: Number,
    })
    @ApiQuery({
        name: 'from',
        required: false,
        description: "Start date (ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSZ)",
    })
    @ApiQuery({
        name: 'before',
        required: false,
        description: "End date (ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSZ)",
    })
    @ApiOperation({ summary: 'Get stored transactions for a specific bank account with filters' })
    @ApiQuery({ name: 'offset', required: false, description: 'Records to skip', type: Number })
    @ApiResponse({ status: 200, type: [BankTransactionDto] })
    @Get('account/:accountId/transaction/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getTransactions(
        @Req() req: AuthenticatedRequest,
        @Param('accountId') accountId: string,
        @Query('from') from?: string,
        @Query('before') before?: string,
        @Query('limit') limit = 50,
        @Query('offset') offset = 0,
        @Query('sort') sort: 'date' | '-date' = '-date'
    ): Promise<BankTransactionDto[]> {
        if (!accountId) throw new BadRequestException('Missing accountId');

        const parsedFrom = from ? new Date(from) : undefined;
        const parsedBefore = before ? new Date(before) : undefined;

        return this.bankService.getStoredTransactions(req.user.sub, accountId, {
            from: parsedFrom,
            before: parsedBefore,
            limit: Math.min(Number(limit), 1000),
            offset: Number(offset),
            sort,
        });
    }

    @ApiOperation({ summary: 'Get transactions across all accounts for the current user' })
    @ApiQuery({ name: 'sort', required: false, enum: ['date', '-date'] })
    @ApiResponse({ status: 200, type: BankTransactionsResponseDto })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'before', required: false })
    @ApiQuery({ name: 'from', required: false })
    @UseGuards(JwtAuthGuard)
    @Get('transaction/all')
    @ApiBearerAuth()
    async getAllTransactions(
        @Req() req: AuthenticatedRequest,
        @Query('from') from?: string,
        @Query('before') before?: string,
        @Query('limit') limit = 50,
        @Query('offset') offset = 0,
        @Query('sort') sort: 'date' | '-date' = '-date'
    ): Promise<BankTransactionsResponseDto> {
        return this.bankService.getAllStoredTransactions(req.user.sub, {
            from: from ? new Date(from) : undefined,
            before: before ? new Date(before) : undefined,
            limit: Math.min(Number(limit), 1000),
            offset: Number(offset),
            sort,
        });
    }

    @ApiResponse({
        status: 200,
        description: 'Array of weekly money in/out totals grouped by direction',
        type: [TransactionStatsDto],
    })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date in ISO format' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date in ISO format' })
    @ApiOperation({ summary: 'Get weekly in/out transaction stats for the user' })
    @UseGuards(JwtAuthGuard)
    @Get('stats/weekly')
    @ApiBearerAuth()
    async getWeeklyStats(
        @Req() req: AuthenticatedRequest,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ): Promise<TransactionStatsDto[]> {
        return this.bankService.getWeeklyStats(req.user.sub, startDate, endDate);
    }

    @ApiResponse({
        status: 200,
        description: 'Array of monthly money in/out totals grouped by direction',
        type: [TransactionStatsDto],
    })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date in ISO format' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date in ISO format' })
    @ApiOperation({ summary: 'Get monthly money in/out stats for the user' })
    @UseGuards(JwtAuthGuard)
    @Get('stats/monthly')
    @ApiBearerAuth()
    async getMonthlyStats(
        @Req() req: AuthenticatedRequest,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ): Promise<TransactionStatsDto[]> {
        return this.bankService.getMonthlyStats(req.user.sub, startDate, endDate);
    }
}
