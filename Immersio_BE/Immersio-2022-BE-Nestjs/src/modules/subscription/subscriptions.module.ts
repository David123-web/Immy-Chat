import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeHelper } from 'src/helpers/stripe';
import { PaypalHelper } from 'src/helpers/paypal';

@Module({
    imports: [PrismaModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, StripeHelper, PaypalHelper]
})
export class SubscriptionPlansModule {}
