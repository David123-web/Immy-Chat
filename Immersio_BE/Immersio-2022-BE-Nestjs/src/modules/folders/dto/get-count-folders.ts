import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCountFoldersDto {
  @ApiPropertyOptional({
      default: '' 
  })
      search: string;
  @ApiPropertyOptional()
      parentFolderId: 'root' | string;
}
