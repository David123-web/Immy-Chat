import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';

export default class FindLessonDto extends PaginationDto<number> {
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
      courseSectionId: number;
}
