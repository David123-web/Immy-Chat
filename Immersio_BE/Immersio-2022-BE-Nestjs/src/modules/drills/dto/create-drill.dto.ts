import {ApiOperation,
    ApiProperty,
    ApiPropertyOptional,} from '@nestjs/swagger';
import { DrillType, SectionType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { DrillItemDto } from './drill-item.dto';

export class CreateDrillDto {
    @ApiProperty()
        instruction: string;

    @ApiProperty()
        lessonId: number;

    @ApiPropertyOptional()
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

    @ApiProperty()
    @IsString()
        parentId: string;
}
