import { ApiPropertyOptional } from '@nestjs/swagger';
import { UploadBinaryFileDto } from 'src/common/dto';

export class CreateGoogleDriveFileDto extends UploadBinaryFileDto {
  @ApiPropertyOptional()
      folderId: string;
}
