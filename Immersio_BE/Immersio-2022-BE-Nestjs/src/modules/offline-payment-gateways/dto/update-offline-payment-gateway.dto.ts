import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOfflinePaymentGatewayDto } from './create-offline-payment-gateway.dto';

export class UpdateOfflinePaymentGatewayDto extends PartialType(
    CreateOfflinePaymentGatewayDto
) {
  @ApiProperty()
      name: string;
  @ApiPropertyOptional()
      description: string;
  @ApiPropertyOptional()
      instruction: string;
  @ApiProperty()
      serialNumber: string;
  @ApiProperty()
      isActivated: boolean;
}
