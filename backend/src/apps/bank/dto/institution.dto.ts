import { ApiProperty } from '@nestjs/swagger';

export class InstitutionCountryDto {
    @ApiProperty()
    displayName: string;

    @ApiProperty()
    countryCode2: string;
}

export class InstitutionMediaDto {
    @ApiProperty()
    source: string;

    @ApiProperty()
    type: string;
}

export class InstitutionDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ type: [InstitutionCountryDto] })
    countries: InstitutionCountryDto[];

    @ApiProperty()
    environmentType: string;

    @ApiProperty()
    credentialsType: string;

    @ApiProperty({ type: [InstitutionMediaDto] })
    media: InstitutionMediaDto[];

    @ApiProperty({ type: [String] })
    features: string[];
}
