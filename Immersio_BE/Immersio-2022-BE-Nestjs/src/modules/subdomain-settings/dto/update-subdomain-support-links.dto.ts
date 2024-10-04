import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateSubdomainSupportLinksDto {
    @ApiPropertyOptional()
    @IsOptional()
        getHelp: string;

    @ApiPropertyOptional()
    @IsOptional()
        contactUs: string;

    @ApiPropertyOptional()
    @IsOptional()
        faqs: string;
}
