import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteFilesDeto {
  @ApiProperty({
      isArray: true 
  })
      ids: string[];
}
