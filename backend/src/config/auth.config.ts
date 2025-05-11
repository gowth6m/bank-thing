import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    jwtSecret: process.env.JWT_SECRET || 'bank-thing-jwt-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
