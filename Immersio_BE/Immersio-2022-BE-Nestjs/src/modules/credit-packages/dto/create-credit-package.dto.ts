import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGatewayType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateCreditPackageDto {
  @ApiProperty()
      name: string;
  @ApiPropertyOptional()
      description: string;
  @ApiProperty()
      price: number;
  @ApiProperty()
      credit: number;
  @ApiPropertyOptional()
      productId: string;
  @ApiPropertyOptional()
  @IsEnum(PaymentGatewayType)
      gateway: PaymentGatewayType;
}
