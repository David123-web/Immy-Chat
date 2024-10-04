import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanStatus } from '@prisma/client';
import {IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,} from 'class-validator';

export class CreatePlanDto {
    @ApiProperty()
    @IsString()
        title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        language: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        course: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        calendarColour: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        description: string;

    @ApiPropertyOptional()
    @IsEnum(PlanStatus)
    @IsOptional()
        status: PlanStatus;

    @ApiPropertyOptional({
        type: Array<number>,
        default: [1],
    })
    @IsArray()
        students: number[];

    @ApiPropertyOptional({
        type: Array<number>,
        default: [1],
    })
    @IsArray()
        tutors: number[];
    @ApiPropertyOptional({
        type: Array<number>,
        default: [1],
    })
    @IsArray()
    @ApiPropertyOptional()
        classTags: string[];
}
