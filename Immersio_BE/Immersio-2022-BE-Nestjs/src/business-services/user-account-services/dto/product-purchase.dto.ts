
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductTypes } from 'src/constants/business-constants';
import { IsNumber } from 'class-validator';

export class ProductPurchaseDTO {
  @ApiProperty()
      productId: string;

  @IsNumber()
  @ApiProperty()
      unitCount: number;

  @ApiProperty()
  @ApiProperty()
      creditsSpent: number;

  @ApiPropertyOptional(
      {
          default: ''
      }
  )
      purchaseId: string;

  @ApiProperty()
      productType: ProductTypes;

  @ApiPropertyOptional({
      default: false 
  }) 
      creditProcessingComplete = false;

  @ApiPropertyOptional({
      default: ''
  })
      creditProcessingMessage: string;
}
