import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';

export default class FindSectionDto extends PaginationDto<number> {
  @ApiPropertyOptional({
      type: String 
  })
      name: string;

  @ApiPropertyOptional({
      type: String 
  })
      sortBy: string;

  @ApiPropertyOptional({
      type: String 
  })
      sortDesc: string;

  @ApiPropertyOptional()
      courseId: number;
}
