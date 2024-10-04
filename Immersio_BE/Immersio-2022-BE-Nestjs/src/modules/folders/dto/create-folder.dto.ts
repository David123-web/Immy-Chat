import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty()
      name: string;
  
  @ApiPropertyOptional()
      parentFolderId: string;
  
  @ApiPropertyOptional({
      default: false 
  })
      public: boolean;
}
