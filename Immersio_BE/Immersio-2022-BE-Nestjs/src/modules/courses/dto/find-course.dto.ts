import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';

export default class FindCourseDto extends PaginationDto<number> {
  @ApiPropertyOptional({
      type: String 
  })
      title: string;

  @ApiPropertyOptional({
      type: String 
  })
      sortBy: string;

  @ApiPropertyOptional({
      type: String 
  })
      sortDesc: string;

  @ApiPropertyOptional()
      isDeleted?: boolean | undefined;
}
