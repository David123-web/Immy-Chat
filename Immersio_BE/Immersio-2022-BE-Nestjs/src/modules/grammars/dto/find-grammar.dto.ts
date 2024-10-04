import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindGrammarDto {
    @ApiPropertyOptional()
    @IsNumber()
        lessonId: number;
}
