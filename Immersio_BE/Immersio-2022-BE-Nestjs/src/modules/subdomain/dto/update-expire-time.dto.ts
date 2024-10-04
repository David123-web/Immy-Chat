import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGatewayType, PaymentMethod } from '@prisma/client';

export class UpdateExpireTimeDto {
    @ApiProperty()
        expiredAt: string;

    @ApiProperty()
        subodmainId: string;
}