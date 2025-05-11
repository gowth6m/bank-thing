import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { EventController } from './event.controller';
import { AuthModule } from '../auth/auth.module';
import { EventService } from './event.service';

@Module({
    imports: [ConfigModule, AuthModule],
    providers: [EventService],
    exports: [EventService],
    controllers: [EventController],
})
export class EventsModule {}
