import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubdomainThemeDto {
    @ApiPropertyOptional()
        primaryColor: string;

    @ApiPropertyOptional()
        secondaryColor: string;

    @ApiPropertyOptional()
        accentColor: string;

    @ApiPropertyOptional()
        textColor: string;

    @ApiPropertyOptional()
        backgroundColor: string;

    @ApiPropertyOptional()
        linkColor: string;

    @ApiPropertyOptional()
        logoUrl: string;

    @ApiPropertyOptional()
        faviconUrl: string;
}
