import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    stage: process.env.STAGE || 'dev',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9095,
    logLevel: process.env.LOG_LEVEL || 'info',

    // Swagger Config
    swagger: {
        title: process.env.SWAGGER_TITLE || 'Bank Thing',
        description: process.env.SWAGGER_DESCRIPTION || 'Bank Thing API Documentation',
        version: process.env.SWAGGER_VERSION || '0.1.0',
        path: process.env.SWAGGER_PATH || 'docs',
    },

    // CORS Config
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
}));
