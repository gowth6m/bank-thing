import 'tsconfig-paths/register';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { mkdirSync, writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';

import { AppModule } from '../apps/app.module';

async function generateSwagger() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    const swaggerConfig = new DocumentBuilder()
        .setTitle(configService.get<string>('app.swagger.title') || 'Bank Thing')
        .setDescription(
            configService.get<string>('app.swagger.description') || 'Bank Thing API Documentation'
        )
        .setVersion(configService.get<string>('app.swagger.version') || '0.1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    const outputDir = join(__dirname, '../../dist');
    mkdirSync(outputDir, { recursive: true });

    writeFileSync(join(outputDir, 'swagger.json'), JSON.stringify(document, null, 2));

    await app.close();
    console.log('✅ Swagger JSON generated at dist/swagger.json');
}

generateSwagger();
