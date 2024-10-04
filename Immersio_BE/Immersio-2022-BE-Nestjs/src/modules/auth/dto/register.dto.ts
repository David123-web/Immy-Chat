import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export default class RegisterDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @ApiPropertyOptional()
        firstName: string;

    @ApiPropertyOptional()
        lastName: string;

    @ApiProperty()
    @IsNotEmpty()
        password: string;

    @ApiPropertyOptional()
        phoneNumber: string;

    @ApiProperty({
        enum: Role 
    })
    @IsNotEmpty()
    @IsEnum(Role)
        role: Role;
}
