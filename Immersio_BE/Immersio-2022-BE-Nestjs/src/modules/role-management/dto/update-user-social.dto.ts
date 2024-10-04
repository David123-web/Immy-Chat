import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserSocialDto {
    @ApiPropertyOptional()
    @IsOptional()
        facebook: string;

    @ApiPropertyOptional()
    @IsOptional()
        twitter: string;

    @ApiPropertyOptional()
    @IsOptional()
        youtube: string;

    @ApiPropertyOptional()
    @IsOptional()
        linkedin: string;

    @ApiPropertyOptional()
    @IsOptional()
        instagram: string;
}
