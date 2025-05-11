import { ApiProperty } from '@nestjs/swagger';

export class BankAccountIdentificationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bankAccountId: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    identification: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class BankAccountDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    accountId: string;

    @ApiProperty()
    institutionId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    accountType: string;

    @ApiProperty()
    usageType: string;

    @ApiProperty()
    balance: number;

    @ApiProperty()
    currency: string;

    @ApiProperty({ type: Object, required: false })
    meta?: any;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: [BankAccountIdentificationDto] })
    bankAccountIdentification: BankAccountIdentificationDto[];
}
