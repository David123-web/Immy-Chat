import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindPhraseDto {
    @ApiPropertyOptional()
    @IsNumber()
        lessonId: number;
}
