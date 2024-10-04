import { ApiPropertyOptional } from '@nestjs/swagger';
import { UploadBinaryFileDto } from 'src/common/dto';

export class UploadFileDto extends UploadBinaryFileDto {
  @ApiPropertyOptional()
      name: string;

  @ApiPropertyOptional()
      folderId: string;

  @ApiPropertyOptional({
      default: false
  })
      public: boolean;
}
