import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddExternalFileDto {
    @ApiProperty()
        name: string;

    @ApiPropertyOptional()
        folderId?: string;

    @ApiProperty()
        link: string;
}
