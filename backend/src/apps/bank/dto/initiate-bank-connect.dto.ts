import { ApiProperty } from '@nestjs/swagger';

export class InitiateBankConnectionResponseDto {
    @ApiProperty({
        example: 'https://auth.yapily.com/redirect?token=...',
        description: 'URL to redirect user for authentication',
    })
    url: string;

    @ApiProperty({
        example: 'https://auth.yapily.com/redirect?token=...',
        description: 'QR code URL for mobile authentication',
    })
    qrCodeUrl?: string;
}

export class InitiateBankConnectionRequestDto {
    @ApiProperty({
        example: 'revolut',
        description: 'Institution ID to connect (Yapily institution key)',
    })
    institutionId: string;

    @ApiProperty({
        example: 'https://yourapp.com/callback',
        description: 'Client callback URL to redirect after authentication',
    })
    callbackUrl: string;
}
