import { ApiProperty } from '@nestjs/swagger';

export class MoveFileDto {
  @ApiProperty()
      folderId: string;
}
