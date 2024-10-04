import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,} from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export default class UpdateTutorDto extends UpdateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
        hourRate: number;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        teachLanguages: number[];

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        languageCodes: string[];

    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // proficiencyLevelCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        qualificationDesc: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        experienceDesc: string;

    @ApiPropertyOptional()
        bio: string;
}
