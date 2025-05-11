import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { YapilyService } from './yapily.service';

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [YapilyService],
    exports: [YapilyService],
})
export class YapilyModule {}
