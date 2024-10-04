import { ApiPropertyOptional } from '@nestjs/swagger';

export class MoveGoogleDriveFileDto  {
  @ApiPropertyOptional()
      folderId: string;
}
