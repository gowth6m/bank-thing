import { TransactionDirection } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionStatsDto {
    @ApiProperty({
        description: 'Start of the time period (week or month)',
        example: '2025-04-01T00:00:00.000Z',
    })
    periodStart: Date;

    @ApiProperty({
        enum: TransactionDirection,
        description: 'Transaction direction: IN (money received) or OUT (money spent)',
        example: TransactionDirection.IN,
    })
    direction: TransactionDirection;

    @ApiProperty({
        description: 'Total transaction amount in this period and direction',
        example: 1234.56,
    })
    total: number;
}
