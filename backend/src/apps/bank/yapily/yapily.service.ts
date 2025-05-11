import { Injectable, BadGatewayException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';

import { AccountDto, CreateAccountAuthResponseDto } from '../dto';

@Injectable()
export class YapilyService {
    private readonly baseUrl: string;
    private readonly appId: string;
    private readonly appSecret: string;
    private readonly logger: PinoLogger;

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) {
        this.baseUrl = this.config.get<string>('yapily.baseUrl')!;
        this.appId = this.config.get<string>('yapily.appId')!;
        this.appSecret = this.config.get<string>('yapily.appSecret')!;
    }

    private get auth() {
        return { username: this.appId, password: this.appSecret };
    }

    private async request<T>(
        method: 'get' | 'post',
        url: string,
        options?: any,
        data?: any
    ): Promise<T> {
        try {
            const response = await lastValueFrom(
                method === 'get'
                    ? this.http.get<{ data: T }>(url, options)
                    : this.http.post<{ data: T }>(url, data, options)
            );
            const payload = response.data?.data;
            if (payload === undefined || payload === null) {
                throw new InternalServerErrorException('Empty response payload');
            }
            return payload;
        } catch (error) {
            this.logger.error(
                `Request failed [${method.toUpperCase()} ${url}]: ${error.message}`,
                error.stack
            );
            throw new BadGatewayException('Yapily API request failed');
        }
    }

    async listInstitutions() {
        return this.request<any[]>('get', `${this.baseUrl}/institutions`, { auth: this.auth });
    }

    async createAccountAuthRequest(
        applicationUserId: string,
        institutionId: string,
        clientCallbackUrl: string,
        serverCallbackUrl: string
    ): Promise<CreateAccountAuthResponseDto> {
        const payload = {
            applicationUserId,
            institutionId,
            callback: `${serverCallbackUrl}?client-callback=${encodeURIComponent(clientCallbackUrl)}`,
        };
        return this.request<CreateAccountAuthResponseDto>(
            'post',
            `${this.baseUrl}/account-auth-requests`,
            { auth: this.auth },
            payload
        );
    }

    async getConsent(consentToken: string) {
        return this.request<any>('get', `${this.baseUrl}/consents/${consentToken}`, {
            auth: this.auth,
        });
    }

    async getAccounts(consentToken: string) {
        return this.request<AccountDto[]>('get', `${this.baseUrl}/accounts`, {
            auth: this.auth,
            headers: { consent: consentToken },
        });
    }

    async getTransactions(
        accountId: string,
        consentToken: string,
        params: { before?: string; offset?: number; limit?: number; from?: string } = {}
    ): Promise<any[]> {
        const query = new URLSearchParams();

        if (params.from) query.append('from', params.from);
        if (params.before) query.append('before', params.before);
        if (params.limit) query.append('limit', String(params.limit));
        if (params.offset) query.append('offset', String(params.offset));

        const url = `${this.baseUrl}/accounts/${accountId}/transactions?${query.toString()}`;

        return this.request<any[]>('get', url, {
            auth: this.auth,
            headers: { consent: consentToken },
        });
    }
}
