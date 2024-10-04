import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationSortDto } from 'src/common/dto';

export class FindCreditPackagesDto extends PaginationSortDto {
  @ApiPropertyOptional()
      name: string;
}
