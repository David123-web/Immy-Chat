import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeHelper } from 'src/helpers/stripe';
import { PaypalHelper } from 'src/helpers/paypal';

@Module({
    imports: [PrismaModule],
    controllers: [CouponsController],
    providers: [CouponsService, StripeHelper, PaypalHelper]
})
export class CouponsModule {}
