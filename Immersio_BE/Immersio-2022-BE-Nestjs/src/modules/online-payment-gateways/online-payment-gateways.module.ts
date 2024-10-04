import { Module } from '@nestjs/common';
import { OnlinePaymentGatewaysService } from './online-payment-gateways.service';
import { OnlinePaymentGatewaysController } from './online-payment-gateways.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [OnlinePaymentGatewaysController],
    providers: [OnlinePaymentGatewaysService],
})
export class OnlinePaymentGatewaysModule {}
