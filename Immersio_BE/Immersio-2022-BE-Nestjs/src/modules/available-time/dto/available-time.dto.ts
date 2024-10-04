import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RepeatDto } from './repeat.dto';

export class AvailableTimeDto {
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        start: Date;

    @ApiPropertyOptional({
        type: RepeatDto,
    })
    @IsOptional()
        repeat: RepeatDto;
}
