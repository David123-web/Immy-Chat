import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCreditPackageDto } from './create-credit-package.dto';

export class UpdateCreditPackageDto extends PartialType(
    CreateCreditPackageDto
) {
  @ApiPropertyOptional()
      name: string;
  @ApiPropertyOptional()
      price: number;
  @ApiPropertyOptional()
      credit: number;
}
