import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseLanguageDto {
  @ApiPropertyOptional()
      name: string;
}
