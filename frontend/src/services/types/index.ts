/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterRequestDto {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  passwordResetToken: string;
  /** @format date-time */
  deletedAt: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface LoginRequestDto {
  password: string;
  email: string;
}

export interface LoginResponseDto {
  refreshToken: string;
  accessToken: string;
  user: UserDto;
}

export interface RefreshRequestDto {
  refreshToken: string;
}

export interface RefreshResponseDto {
  refreshToken: string;
  accessToken: string;
}

export interface InstitutionCountryDto {
  displayName: string;
  countryCode2: string;
}

export interface InstitutionMediaDto {
  source: string;
  type: string;
}

export interface InstitutionDto {
  id: string;
  name: string;
  fullName: string;
  countries: InstitutionCountryDto[];
  environmentType: string;
  credentialsType: string;
  media: InstitutionMediaDto[];
  features: string[];
}

export interface InitiateBankConnectionRequestDto {
  /**
   * Institution ID to connect (Yapily institution key)
   * @example "revolut"
   */
  institutionId: string;
  /**
   * Client callback URL to redirect after authentication
   * @example "https://yourapp.com/callback"
   */
  callbackUrl: string;
}

export interface InitiateBankConnectionResponseDto {
  /**
   * URL to redirect user for authentication
   * @example "https://auth.yapily.com/redirect?token=..."
   */
  url: string;
  /**
   * QR code URL for mobile authentication
   * @example "https://auth.yapily.com/redirect?token=..."
   */
  qrCodeUrl: string;
}

export interface BankAccountIdentificationDto {
  id: string;
  bankAccountId: string;
  type: string;
  identification: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface BankAccountDto {
  id: string;
  userId: string;
  accountId: string;
  institutionId: string;
  name: string;
  accountType: string;
  usageType: string;
  balance: number;
  currency: string;
  meta?: object;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  bankAccountIdentification: BankAccountIdentificationDto[];
}

export interface AccountIdentificationDto {
  type: string;
  identification: string;
}

export interface PartyDetailsDto {
  name: string;
  accountIdentifications: AccountIdentificationDto[];
}

export interface BankTransactionDto {
  id: string;
  bankAccountId: string;
  transactionId: string;
  /** @format date-time */
  date: string;
  status: string;
  amount: number;
  currency: string;
  direction: string;
  reference?: object | null;
  description?: object | null;
  transactionInfo?: string[];
  isoCode?: object | null;
  proprietaryCode?: object | null;
  enrichment?: object | null;
  meta?: object | null;
  balanceAmount?: object | null;
  balanceCurrency?: object | null;
  payeeDetails?: PartyDetailsDto | null;
  payerDetails?: PartyDetailsDto | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface BankTransactionsResponseDto {
  data: BankTransactionDto[];
  total: number;
}

export interface TransactionStatsDto {
  /**
   * Start of the time period (week or month)
   * @format date-time
   * @example "2025-04-01T00:00:00.000Z"
   */
  periodStart: string;
  /**
   * Transaction direction: IN (money received) or OUT (money spent)
   * @example "IN"
   */
  direction: "IN" | "OUT";
  /**
   * Total transaction amount in this period and direction
   * @example 1234.56
   */
  total: number;
}
