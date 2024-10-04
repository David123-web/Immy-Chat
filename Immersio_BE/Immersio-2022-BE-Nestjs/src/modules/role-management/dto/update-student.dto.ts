import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {  Role } from '@prisma/client';
import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export default class UpdateStudentDto extends UpdateUserDto {
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
