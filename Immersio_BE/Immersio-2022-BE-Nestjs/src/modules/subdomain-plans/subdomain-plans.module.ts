import { Module } from '@nestjs/common';
import { SubdomainPlansService } from './subdomain-plans.service';
import { SubdomainPlansController } from './subdomain-plans.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeHelper } from 'src/helpers/stripe';
import { PaypalHelper } from 'src/helpers/paypal';

@Module({
    imports: [PrismaModule],
    controllers: [SubdomainPlansController],
    providers: [SubdomainPlansService, StripeHelper, PaypalHelper]
})
export class SubdomainPlansModule {}
