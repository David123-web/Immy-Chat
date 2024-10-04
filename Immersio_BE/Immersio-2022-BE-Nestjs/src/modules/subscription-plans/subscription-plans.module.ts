import { Module } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { SubscriptionPlansController } from './subscription-plans.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonBusinessModule } from '../common-business/common-business.module';

@Module({
    imports: [CommonBusinessModule, PrismaModule],
    controllers: [SubscriptionPlansController],
    providers: [SubscriptionPlansService]
})
export class SubscriptionPlansModule {}
