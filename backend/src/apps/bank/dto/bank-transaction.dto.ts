import { ApiProperty } from '@nestjs/swagger';

export class YapilyBankTransactionDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    bookingDateTime: string;

    @ApiProperty()
    valueDateTime: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    transactionAmount: TransactionAmountDto;

    @ApiProperty({ required: false })
    reference?: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ type: [String], required: false })
    transactionInformation?: string[];

    @ApiProperty({ required: false })
    isoBankTransactionCode?: IsoBankTransactionCodeDto;

    @ApiProperty({ required: false })
    proprietaryBankTransactionCode?: ProprietaryCodeDto;

    @ApiProperty({ required: false })
    balance?: BalanceDto;

    @ApiProperty({ required: false })
    enrichment?: TransactionEnrichmentDto;
}

export class IsoBankTransactionCodeDto {
    @ApiProperty()
    domainCode: CodeDto;

    @ApiProperty()
    familyCode: CodeDto;

    @ApiProperty()
    subFamilyCode: CodeDto;
}

export class BalanceDto {
    @ApiProperty()
    type: string;

    @ApiProperty()
    balanceAmount: BalanceAmountDto;
}

export class TransactionAmountDto {
    @ApiProperty()
    amount: number;

    @ApiProperty()
    currency: string;
}

export class BalanceAmountDto {
    @ApiProperty()
    amount: number;

    @ApiProperty()
    currency: string;
}

export class ProprietaryCodeDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    issuer: string;
}

export class TransactionEnrichmentDto {
    @ApiProperty()
    transactionHash: {
        hash: string;
    };
}

export class CodeDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;
}
