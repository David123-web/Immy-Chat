import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGatewayType } from '@prisma/client';

export class CreateOnlinePaymentGatewayDto {
    @ApiProperty({
        enum: PaymentGatewayType
    })
        type: PaymentGatewayType;

    @ApiProperty()
        subdomainId: string;

    @ApiPropertyOptional()
        clientId: string;

    @ApiPropertyOptional()
        secretKey: string;

    @ApiProperty()
        isActivated: boolean;
}
