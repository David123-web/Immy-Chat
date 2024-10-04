import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek, Repeat, RepeatType } from '@prisma/client';
import {IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,} from 'class-validator';

export class RepeatDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
        amount: number;

    @ApiPropertyOptional({
        enum: DayOfWeek,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
        dayOfWeeks?: DayOfWeek[];

    @ApiPropertyOptional({
        enum: RepeatType,
    })
    @IsOptional()
    @IsEnum(RepeatType)
        type: RepeatType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDate()
        end: Date;

    @ApiPropertyOptional({
        type: Array.of(Date),
    })
    @IsOptional()
    @IsArray()
        dateExceptions: Date[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
        occurrence: number;
}
