import { ApiPropertyOptional } from '@nestjs/swagger';
import { UploadBinaryFileDto } from 'src/common/dto';

export class RenameGoogleDriveFileDto {
  @ApiPropertyOptional()
      name: string;
}
