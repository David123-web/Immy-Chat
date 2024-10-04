import { Module } from '@nestjs/common';
import { OfflinePaymentGatewaysService } from './offline-payment-gateways.service';
import { OfflinePaymentGatewaysController } from './offline-payment-gateways.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [OfflinePaymentGatewaysController],
    providers: [OfflinePaymentGatewaysService]
})
export class OfflinePaymentGatewaysModule {}
