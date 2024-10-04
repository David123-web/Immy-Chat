import { SubscriptionStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionDto {

    @ApiProperty()
        userId: string;

    @ApiProperty()
        planId: string;

    @ApiProperty()
        subdomainId: string;

    @ApiPropertyOptional()
        referenceId?: string;

    @ApiProperty()
        status: SubscriptionStatus;

    @ApiProperty()
        method: PaymentMethod;

    @ApiPropertyOptional()
        trialEndAt?: Date;

    @ApiProperty()
        endAt: Date;

    @ApiProperty()
        nextBillingTime?: Date;
}