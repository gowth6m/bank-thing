import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class LoginResponseDto {
    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    user: UserDto;
}
