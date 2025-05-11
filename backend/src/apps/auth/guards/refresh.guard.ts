import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';

import { JwtDto } from '../dto/jwt.dto';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private logger: Logger,
        private configService: ConfigService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.body.refreshToken;

        try {
            const payload: JwtDto = this.jwtService.verify(token, {
                secret: this.configService.get<string>('auth.jwtSecret'),
            });
            request.jwtDto = payload;
            return true;
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }
}
