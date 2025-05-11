import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountAuthMetaDto {
    @ApiProperty()
    tracingId: string;
}

export class CreateAccountAuthResponseDto {
    @ApiProperty({ type: () => CreateAccountAuthMetaDto })
    meta: CreateAccountAuthMetaDto;

    @ApiProperty()
    id: string;

    @ApiProperty()
    userUuid: string;

    @ApiProperty()
    applicationUserId: string;

    @ApiProperty()
    institutionId: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty({ type: [String] })
    featureScope: string[];

    @ApiProperty()
    state: string;

    @ApiProperty()
    institutionConsentId: string;

    @ApiProperty()
    authorisationUrl: string;

    @ApiProperty()
    qrCodeUrl: string;
}
