import { registerAs } from '@nestjs/config';

export default registerAs('yapily', () => ({
    baseUrl: process.env.YAPILY_BASE_URL || 'https://api.yapily.com',
    appId: process.env.YAPILY_APP_ID || 'your-client-id',
    appSecret: process.env.YAPILY_APP_SECRET || 'your-client-secret',
}));
