import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCountFilesDto {
  @ApiPropertyOptional({
      default: '' 
  })
      search: string;
  @ApiPropertyOptional()
      folderId: 'root' | string;
}
