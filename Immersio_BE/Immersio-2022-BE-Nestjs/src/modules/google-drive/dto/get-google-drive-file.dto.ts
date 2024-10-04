import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetGoogleDriveFileDto {
    @ApiPropertyOptional()
        pageSize: number;
    @ApiPropertyOptional()
        pageToken: string;
    @ApiPropertyOptional()
        folderId: string;
}
