import yapilyConfig from 'src/config/yapily.config';
import redisConfig from 'src/config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';

import databaseConfig from '../config/database.config';
import { EventsModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import authConfig from '../config/auth.config';
import appConfig from '../config/app.config';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            load: [appConfig, databaseConfig, authConfig, yapilyConfig, redisConfig],
            isGlobal: true,
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    options: { colorize: true },
                    target: 'pino-pretty',
                    level: appConfig().logLevel,
                },
            },
        }),
        AuthModule,
        BankModule,
        EventsModule,
    ],
})
export class AppModule {}
