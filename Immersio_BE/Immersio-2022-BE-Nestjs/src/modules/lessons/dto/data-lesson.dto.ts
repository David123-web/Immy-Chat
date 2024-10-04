import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class LessonDataDto {
    @ApiProperty()
        lessonId: number;
        
    @ApiProperty()
        value: string;

    @ApiPropertyOptional()
        index: number;

    @ApiProperty()
        explanation: string;

    @ApiProperty()
        medias: string[];
}
