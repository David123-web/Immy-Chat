import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export default class CreateTutorDto extends CreateUserDto {
    role = Role.TUTOR;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
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
    //     proficiencyLevelCode: string;

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
