import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateSubdomainSocialDto {
    @ApiPropertyOptional()
    @IsOptional()
        facebook: string;

    @ApiPropertyOptional()
    @IsOptional()
        instagram: string;

    @ApiPropertyOptional()
    @IsOptional()
        youtube: string;
}
