import { ApiProperty } from '@nestjs/swagger';

export class MoveFolderDto {
  @ApiProperty()
      parentFolderId: string;
}
