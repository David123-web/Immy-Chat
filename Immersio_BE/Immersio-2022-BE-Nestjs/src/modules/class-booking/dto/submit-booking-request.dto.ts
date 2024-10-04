import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsEmail,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,} from 'class-validator';

export class SubmitBookingRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        classBookingId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        tutorId: number;

    @ApiProperty({
        type: Date,
        default: new Date(),
    })
    @IsNotEmpty()
        trialSession: string | Date;

    @ApiProperty()
    @IsNotEmpty()
        name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
        email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
        phoneNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        aboutStudent?: string;
}
