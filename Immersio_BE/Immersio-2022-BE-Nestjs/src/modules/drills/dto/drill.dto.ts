import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DrillType, SectionType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { DrillItemDto } from './drill-item.dto';

export class DrillDto {
    @ApiProperty()
        id: string;

    @ApiProperty()
        instruction: string;

    @ApiProperty()
        index: number;

    @ApiProperty()
    @IsEnum(SectionType)
        sectionType: SectionType;

    @ApiProperty({
        type: Array.of(DrillItemDto),
    })
        data: DrillItemDto[];

    @ApiProperty()
    @IsEnum(DrillType)
        type: DrillType;

    @ApiPropertyOptional()
    @IsString()
        parentId: string;
}
