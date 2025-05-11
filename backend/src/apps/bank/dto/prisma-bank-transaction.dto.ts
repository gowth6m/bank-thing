import { JsonValue } from '@prisma/client/runtime/library';
import { ApiProperty } from '@nestjs/swagger';

class AccountIdentificationDto {
    @ApiProperty()
    type: string;

    @ApiProperty()
    identification: string;
}

class PartyDetailsDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ type: [AccountIdentificationDto] })
    accountIdentifications: AccountIdentificationDto[];
}

export class BankTransactionDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bankAccountId: string;

    @ApiProperty()
    transactionId: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    status: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    direction: string;

    @ApiProperty({ required: false, nullable: true })
    reference?: string | null;

    @ApiProperty({ required: false, nullable: true })
    description?: string | null;

    @ApiProperty({ type: [String], required: false })
    transactionInfo?: string[];

    @ApiProperty({ type: Object, required: false, nullable: true })
    isoCode?: Record<string, any> | null;

    @ApiProperty({ type: Object, required: false, nullable: true })
    proprietaryCode?: Record<string, any> | null;

    @ApiProperty({ type: Object, required: false, nullable: true })
    enrichment?: Record<string, any> | null;

    @ApiProperty({ type: Object, required: false, nullable: true })
    meta?: JsonValue | null;

    @ApiProperty({ required: false, nullable: true })
    balanceAmount?: number | null;

    @ApiProperty({ required: false, nullable: true })
    balanceCurrency?: string | null;

    @ApiProperty({ type: PartyDetailsDto, required: false, nullable: true })
    payeeDetails?: PartyDetailsDto | null;

    @ApiProperty({ type: PartyDetailsDto, required: false, nullable: true })
    payerDetails?: PartyDetailsDto | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class BankTransactionsResponseDto {
    @ApiProperty({ type: [BankTransactionDto] })
    data: BankTransactionDto[];

    @ApiProperty()
    total: number;
}
