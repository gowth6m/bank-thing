import { ApiProperty } from '@nestjs/swagger';

export class BalanceAmountDto {
    @ApiProperty()
    amount: number;

    @ApiProperty()
    currency: string;
}
export class AccountBalanceDto {
    @ApiProperty()
    type: string;

    @ApiProperty()
    dateTime: string;

    @ApiProperty({ type: () => BalanceAmountDto })
    balanceAmount: BalanceAmountDto;

    @ApiProperty()
    creditLineIncluded: boolean;

    @ApiProperty({ type: [Object] })
    creditLines: any[];
}

export class AccountIdentificationDto {
    @ApiProperty()
    type: string;

    @ApiProperty()
    identification: string;
}

export class AccountNameDto {
    @ApiProperty()
    name: string;
}

export class AccountDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    balance: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    usageType: string;

    @ApiProperty()
    accountType: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty({ type: [AccountNameDto] })
    accountNames: AccountNameDto[];

    @ApiProperty({ type: [AccountIdentificationDto] })
    accountIdentifications: AccountIdentificationDto[];

    @ApiProperty({ type: [AccountBalanceDto] })
    accountBalances: AccountBalanceDto[];
}
