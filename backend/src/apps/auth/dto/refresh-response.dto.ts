import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    accessToken: string;
}
