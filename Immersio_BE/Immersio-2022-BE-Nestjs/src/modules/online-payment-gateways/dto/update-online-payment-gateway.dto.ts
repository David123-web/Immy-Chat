import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaymentGatewayType } from '@prisma/client';
import { CreateOnlinePaymentGatewayDto } from './create-online-payment-gateway.dto';

export class UpdateOnlinePaymentGatewayDto extends PartialType(
    CreateOnlinePaymentGatewayDto
) {
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
