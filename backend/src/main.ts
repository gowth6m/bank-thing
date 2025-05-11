import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './apps/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    const configService = app.get(ConfigService);
    const logger = app.get(Logger);

    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useLogger(logger);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors({
        origin: configService.get<string>('app.cors.origin') || '*',
        methods: configService.get<string>('app.cors.methods') || 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Swagger setup
    const swaggerTitle = configService.get<string>('app.swagger.title') || 'Bank Thing';
    const swaggerDescription =
        configService.get<string>('app.swagger.description') || 'Bank Thing API Documentation';
    const swaggerVersion = configService.get<string>('app.swagger.version') || '0.1.0';
    const swaggerPath = configService.get<string>('app.swagger.path') || 'docs';

    const swaggerConfig = new DocumentBuilder()
        .setTitle(swaggerTitle)
        .setDescription(swaggerDescription)
        .setVersion(swaggerVersion)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document);

    // Start Server
    const port = configService.get<number>('app.port') || 9095;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Server running on http://0.0.0.0:${port}`);
}
bootstrap();
