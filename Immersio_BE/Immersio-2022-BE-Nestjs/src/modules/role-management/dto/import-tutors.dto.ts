import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ImportTutorsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        avatarUrl: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        firstName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        lastName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        phoneNumber: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        hourRate: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        teachLanguages: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        languageSpoken: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        timeZone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        accountStatus: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        address: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        zipCode: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        city: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        state: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        country: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        qualification: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        teachingExperience: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        bio: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        classTag: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        dialCode: string;
}
