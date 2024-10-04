import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteFoldersDto {
  @ApiProperty({
      isArray: true 
  })
      ids: string[];
}
