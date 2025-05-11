import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    mongodb: {
        url: process.env.MONGODB_URL,
    },
}));
