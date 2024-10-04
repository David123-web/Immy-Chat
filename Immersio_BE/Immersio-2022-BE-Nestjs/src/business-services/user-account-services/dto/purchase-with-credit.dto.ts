import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPurchaseDTO } from './product-purchase.dto'; 
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class PurchaseWithCreditDTO {
  @ApiProperty()
      subdomainId: string;

  @ApiProperty()
      purchaserId: string;

  @ApiProperty()
      userId: string;

  @ApiProperty()
      totalCreditsSpent: number;

  @ApiProperty()
      paymentMethod: PaymentMethod;

  @ApiProperty({
      isArray: true,
  })
  @ValidateNested({
      each: true 
  })
  @Type(() => ProductPurchaseDTO)
      products: ProductPurchaseDTO[];
}
