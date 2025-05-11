import type { AxiosInstance, AxiosResponse } from 'axios';

import type { InstitutionDto, BankAccountDto, BankTransactionDto, BankTransactionsResponseDto, InitiateBankConnectionRequestDto, TransactionStatsDto } from '../types';

// ------------------------------------------------------------------------

export default class BankClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async institutions(): Promise<AxiosResponse<InstitutionDto[]>> {
    return this.client.get('/institutions');
  }

  async connectBankAccount(
    payload: InitiateBankConnectionRequestDto
  ): Promise<AxiosResponse<{ url: string }>> {
    return this.client.post('/connect', payload);
  }

  async getBankAccount(): Promise<AxiosResponse<BankAccountDto[]>> {
    return this.client.get('/account/all');
  }

  async getAccountTransactions(
    accountId: string,
    limit?: number,
    offset?: number,
    startDate?: string,
    endDate?: string
  ): Promise<AxiosResponse<BankTransactionDto[]>> {
    return this.client.get(`/account/${accountId}/transaction/all`, {
      params: { startDate, endDate, limit, offset },
    });
  }

  async getAllTransactions(
    limit?: number,
    offset?: number,
    startDate?: string,
    endDate?: string
  ): Promise<AxiosResponse<BankTransactionsResponseDto>> {
    return this.client.get('/transaction/all', {
      params: { startDate, endDate, limit, offset },
    });
  }

  async getWeeklyStats(
    startDate?: string,
    endDate?: string
  ): Promise<AxiosResponse<TransactionStatsDto[]>> {
    return this.client.get('/stats/weekly', {
      params: { startDate, endDate },
    });
  }

  async getMonthlyStats(
    startDate?: string,
    endDate?: string
  ): Promise<AxiosResponse<TransactionStatsDto[]>> {
    return this.client.get('/stats/monthly', {
      params: { startDate, endDate },
    });
  }
}
