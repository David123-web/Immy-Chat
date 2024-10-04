import { ApiProperty } from '@nestjs/swagger';
import { EmailSMTPSecure } from '@prisma/client';
import {IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,} from 'class-validator';

export class UpdateSubdomainEmailSMTPDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
        fromEmail: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        fromName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        host: string;

    @ApiProperty({
        enum: EmailSMTPSecure,
    })
    @IsNotEmpty()
    @IsString()
        secure: EmailSMTPSecure;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        port: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
        authenticate: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        password: string;
}
