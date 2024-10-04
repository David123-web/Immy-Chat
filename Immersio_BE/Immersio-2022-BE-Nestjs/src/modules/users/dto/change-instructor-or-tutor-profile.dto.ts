import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { BaseProfileDto } from './base-profile.dto';// Adjust the import path as necessary

export default class ChangeInstructorOrTutorProfileDto extends BaseProfileDto {

    @ApiPropertyOptional()
    @IsUrl()
    website?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    qualificationDesc: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    experienceDesc: string;

    @ApiPropertyOptional()
    title?: string;
}
