import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { EventPayload } from './event.types';

const getChannel = (userId: string) => `events:${userId}`;

@Injectable()
export class EventService implements OnModuleDestroy {
    private pub: Redis;
    private sub: Redis;
    private handlers = new Map<string, (payload: EventPayload) => void>();

    constructor(private readonly config: ConfigService) {
        const redisHost = config.get<string>('redis.host', 'localhost');
        const redisPort = config.get<number>('redis.port', 6379);
        const redisUrl = `redis://${redisHost}:${redisPort}`;

        this.pub = new Redis(redisUrl);
        this.sub = new Redis(redisUrl);

        this.sub.on('message', (channel: string, raw: string) => {
            const handler = this.handlers.get(channel);
            if (!handler) return;

            try {
                const payload = JSON.parse(raw) as EventPayload;
                handler(payload);
            } catch (err) {
                console.error('Failed to parse event payload:', err);
            }
        });
    }

    emit(userId: string, type: string, data: Record<string, any>) {
        this.pub.publish(
            getChannel(userId),
            JSON.stringify({
                type,
                userId,
                data,
                timestamp: new Date().toISOString(),
            })
        );
    }

    on(userId: string, callback: (payload: EventPayload) => void) {
        const channel = getChannel(userId);
        this.handlers.set(channel, (payload) => {
            callback(payload);
            this.off(userId); // auto-cleanup after single use
        });
        this.sub.subscribe(channel);
    }

    off(userId: string) {
        const channel = getChannel(userId);
        this.sub.unsubscribe(channel);
        this.handlers.delete(channel);
    }

    async onModuleDestroy() {
        await this.pub.quit();
        await this.sub.quit();
    }
}
