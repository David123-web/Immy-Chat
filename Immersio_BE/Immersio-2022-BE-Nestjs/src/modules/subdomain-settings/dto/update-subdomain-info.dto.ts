import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubdomainInfoDto {
    @ApiPropertyOptional()
        title: string;

    @ApiPropertyOptional()
        email: string;

    @ApiPropertyOptional()
        contactNumber: string;

    @ApiPropertyOptional()
        address: string;
}
