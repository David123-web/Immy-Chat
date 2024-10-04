import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class GetAvailableTimeDto {
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        start: Date;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        end: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        userId: string;
}
