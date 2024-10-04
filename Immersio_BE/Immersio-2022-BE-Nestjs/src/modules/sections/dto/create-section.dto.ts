import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty()
      courseId: number;
  @ApiPropertyOptional()
      index: number;
  @ApiProperty()
      title: string;
}
