import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindVocabularyDto {
    @ApiPropertyOptional()
    @IsNumber()
        lessonId: number;
}
