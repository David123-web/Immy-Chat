// BaseProfileDto.ts
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNumber, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BaseProfileDto {
    @ApiPropertyOptional({
        type: String 
    })
        firstName?: string;

    @ApiPropertyOptional({
        type: String 
    })
        lastName?: string;

    @ApiPropertyOptional()
        phoneNumber?: string;

    
    @ApiPropertyOptional()
        @IsString()
        dialCode?: string;
    
    @ApiPropertyOptional({
        type: String 
    })
        avatarUrl?: string;

    @ApiPropertyOptional()
        bio?: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
        languageCodes: string[];

    @ApiProperty({
        enum: Role 
    })
    @IsEnum(Role)
        role: Role;

    @ApiPropertyOptional({
        type: Array<number> 
    })
    @IsArray()
        teachLanguages: number[];

    @ApiPropertyOptional()
    @IsNumber()
        hourRate?: number;
}
