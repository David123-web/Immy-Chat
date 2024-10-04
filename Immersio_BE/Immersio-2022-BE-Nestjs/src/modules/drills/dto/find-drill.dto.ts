import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SectionType } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';
import { PaginationSortDto } from 'src/common/dto';

export class FindDrillDto extends PaginationSortDto {
    @ApiProperty()
    @IsNumber()
        lessonId: number;

    @ApiPropertyOptional()
        sectionType: SectionType;
}
