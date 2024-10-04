import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,} from 'class-validator';
import { RepeatDto } from './repeat.dto';
import { AvailableTimeDto } from './available-time.dto';

export class CreateAvailableTimeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        userId: string;

    @ApiPropertyOptional({
        type: Array<number>,
        default: [0],
    })
    @IsArray()
        deleteIds: number[];

    @ApiPropertyOptional({
        type: Array.of(AvailableTimeDto),
    })
    @IsArray()
        availableTimes: AvailableTimeDto[];
}
