import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,} from 'class-validator';

export default class RegisterInstructorDto {
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

    @ApiProperty({
        enum: Role,
    })
    @IsNotEmpty()
    @IsEnum(Role)
        role: Role;

    @ApiPropertyOptional()
        countryCode: string;

    @ApiPropertyOptional()
        phoneNumber: string;

    @ApiPropertyOptional()
    @IsString()
        dialCode: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        languageCodes: string[];

    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // proficiencyLevelCode: string;

    @ApiPropertyOptional()
        website: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        qualificationDesc: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        experienceDesc: string;

    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // relatedMaterialDesc: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        teachLanguages: number[];

    @ApiPropertyOptional({
        type: String,
    })
        avatarUrl: string;

    @ApiPropertyOptional()
        bio: string;

    @ApiPropertyOptional()
        title: string;

    @ApiPropertyOptional()
        hourRate: number;
}
