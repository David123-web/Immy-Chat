import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingConfirmation } from '@prisma/client';
import {IsDateString,
    IsOptional,
    IsNotEmpty,
    IsArray,
    IsISO8601,
    IsNumber,} from 'class-validator';

export class GetClassesTimeDto {
    @ApiProperty({
        type: Date,
        default: new Date().toISOString(),
    })
    @IsNotEmpty()
    @IsISO8601()
        startDate: string;

    @ApiProperty({
        type: Date,
        default: new Date().toISOString(),
    })
    @IsNotEmpty()
    @IsISO8601()
        endDate: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
        tutorId: number;

    @ApiPropertyOptional({
        type: Array<string>,
        default: [
            BookingConfirmation.CONFIRMED,
            BookingConfirmation.REJECTED,
            BookingConfirmation.PENDING,
        ],
    })
    @IsOptional()
    @IsArray()
        classStatus: string[];

    @ApiPropertyOptional({
        type: Array<string>,
        default: ['string'],
    })
    @IsArray()
    @IsOptional()
        campusIds: string[];
}
