import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RepeatType } from '@prisma/client';
import {IsArray,
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,} from 'class-validator';

export class CreateClassBookingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        planId: string;

    @ApiProperty({
        type: Date,
        default: new Date(),
    })
    @IsNotEmpty()
    @IsDateString()
        startTime: string | Date;

    @ApiProperty({
        type: Date,
        default: new Date(),
    })
    @IsNotEmpty()
    @IsDateString()
        finishTime: string | Date;

    @ApiProperty()
    @IsNotEmpty()
        timezoneAbbr: string;

    @ApiPropertyOptional()
        topic: string;

    @ApiProperty({
        type: Array<number>,
        default: [1],
    })
    @IsNotEmpty()
        studentIds: number[];

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
        tutorId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        studentChargeRateHour: number;

    @ApiPropertyOptional({
        default: RepeatType.DAY,
    })
    @IsOptional()
        repeatType?: RepeatType;

    @ApiPropertyOptional({
        type: Date,
        default: new Date(),
    })
    @IsOptional()
    @IsDateString()
        repeatUntilDate: string | Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
        repeatData: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        tutorChargeRateHour: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
        studentPremiumAmount: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
        maxStudents: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        campusId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        roomId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        virtualClassLink: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
        isRepeat: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
        isPublic: boolean;
}
