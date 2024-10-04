import { ApiProperty } from '@nestjs/swagger';

export class CompleteCourseDto {
  @ApiProperty()
      lessonId: number;

  @ApiProperty()
      courseId: number;

  @ApiProperty()
      indexStep: number;

  @ApiProperty()
      isCompleted: boolean;
}
