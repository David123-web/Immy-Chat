import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetLanguagesHasCourseDto {
    @ApiPropertyOptional()
    @IsOptional()
        isFree?: boolean;
}
