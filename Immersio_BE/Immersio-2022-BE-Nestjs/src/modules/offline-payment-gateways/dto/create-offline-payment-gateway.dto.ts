import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfflinePaymentGatewayDto {
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
