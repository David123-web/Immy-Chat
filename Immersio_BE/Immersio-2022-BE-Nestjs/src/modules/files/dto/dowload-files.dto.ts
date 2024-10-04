import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DownloadFilesDto {
  @ApiProperty({
      isArray: true 
  })
      ids: string[];
}
