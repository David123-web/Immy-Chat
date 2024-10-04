import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import {IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,} from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
        avatarUrl: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
        email: string;

    @ApiProperty()
    @IsNotEmpty()
        firstName: string;

    @ApiProperty()
    @IsNotEmpty()
        lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Role)
        role: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
        timezone?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(UserStatus)
        status?: UserStatus;

    @ApiProperty()
    @IsOptional()
    @IsString()
        dialCode?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumberString()
        phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
        address?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
        zipCode?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
        city?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
        state?: string;

    @ApiProperty()
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
