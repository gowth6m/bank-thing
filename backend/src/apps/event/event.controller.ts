import { ApiTags, ApiQuery, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Get, Req, Res, Query, Controller, UnauthorizedException } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { AuthenticatedRequest } from 'src/apps/auth/dto';
import { Response as ExpressResponse } from 'express';
import { JwtService } from '@nestjs/jwt';

import { EventService } from './event.service';

@Controller('event')
@ApiTags('Event')
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly jwtService: JwtService,
        @InjectPinoLogger(EventController.name)
        private readonly logger: PinoLogger
    ) {}

    @ApiResponse({
        status: 200,
        description: 'SSE stream established. Returns text/event-stream.',
        content: {
            'text/event-stream': {
                schema: {
                    type: 'string',
                    example: 'data: {"event":"sync-complete"}\n\n',
                },
            },
        },
    })
    @ApiOperation({
        summary: 'Subscribe to per-user transaction sync updates via SSE',
        description:
            'Streams server-sent events (SSE) for transaction updates. Requires a valid JWT passed via `token` query param.',
    })
    @ApiQuery({
        name: 'token',
        required: true,
        description: 'JWT token for user authentication',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized: Invalid token' })
    @ApiBearerAuth()
    @Get('sync')
    subscribeToTransactionSync(
        @Query('token') token: string,
        @Req() req: AuthenticatedRequest,
        @Res() res: ExpressResponse
    ): void {
        let userId: string;

        try {
            const decoded = this.jwtService.verify(token);
            userId = decoded.sub;
        } catch (err) {
            this.logger.error('Invalid token', err);
            throw new UnauthorizedException('Invalid token');
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        let pingCount = 0;
        const MAX_PINGS = 3;

        const pingInterval = setInterval(() => {
            pingCount++;
            res.write(`: ping\n\n`);

            if (pingCount >= MAX_PINGS) {
                this.logger.debug(`Closing SSE connection for ${userId} after ${MAX_PINGS} pings`);
                cleanup();
                res.end();
            }
        }, 15000);

        const onData = (payload: any) => {
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
            cleanup();
            res.end();
        };

        const cleanup = () => {
            this.eventService.off(userId);
            clearInterval(pingInterval);
            req.removeListener('close', cleanup);
        };

        this.eventService.on(userId, onData);
        req.on('close', cleanup);
    }
}
