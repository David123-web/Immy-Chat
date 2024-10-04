import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';
export class FindLogsDto extends PaginationDto<string> {
  @ApiPropertyOptional({
      type: String 
  })
      sortBy: string;

  @ApiPropertyOptional({
      type: String 
  })
      sortDesc: string;
}
