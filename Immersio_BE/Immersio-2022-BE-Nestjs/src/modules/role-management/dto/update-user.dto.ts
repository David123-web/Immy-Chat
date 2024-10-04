import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import {IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,} from 'class-validator';

export class UpdateUserDto {
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
        timezone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(UserStatus)
        status?: UserStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        dialCode?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
        phoneNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        zipCode?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        city?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        state?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
        country?: string;

    @ApiPropertyOptional({
        type: Array<string>,
        default: ['string'],
    })
    @IsOptional()
        classTagIds: string[];
}
