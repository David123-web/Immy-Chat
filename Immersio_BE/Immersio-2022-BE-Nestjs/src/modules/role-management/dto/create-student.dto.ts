import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export default class CreateStudentDto extends CreateUserDto {
    role = Role.STUDENT;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        languageCodes: string[];

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        learningLanguages: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        parentFirstName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        parentLastName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
        parentEmail: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        parentDialCode?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
        parentPhoneNumber?: string;
}
