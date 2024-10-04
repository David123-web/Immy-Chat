import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubmitLessonCompleteDto {
    @ApiProperty()
    @IsNotEmpty()
        lessonId: number;

    @ApiProperty()
    @IsNotEmpty()
        classId: number;
}
