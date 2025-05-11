import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { YapilyModule } from './yapily/yapily.module';
import { EventsModule } from '../event/event.module';
import { BankController } from './bank.controller';
import { BankProcessor } from './bank.processor';
import { BankCronService } from './bank.cron';
import { BankService } from './bank.service';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        PrismaModule,
        YapilyModule,
        EventsModule,
        ScheduleModule,
        BullModule.registerQueueAsync({
            name: 'bank-sync',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                redis: {
                    host: config.get<string>('redis.host', 'localhost'),
                    port: config.get<number>('redis.port', 6379),
                },
            }),
        }),
    ],
    providers: [BankService, BankProcessor, BankCronService],
    controllers: [BankController],
    exports: [BankService],
})
export class BankModule {}
