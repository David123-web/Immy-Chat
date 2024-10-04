import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';

export default class FindDialogLinesDto extends PaginationDto<number> {
  @ApiPropertyOptional({
      type: Number 
  })
      dialogId: number;

  @ApiPropertyOptional({
      type: String 
  })
      sortBy: string;

  @ApiPropertyOptional({
      type: String 
  })
      sortDesc: string;
}
