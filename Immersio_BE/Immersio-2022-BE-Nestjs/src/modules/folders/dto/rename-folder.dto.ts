import { ApiProperty } from '@nestjs/swagger';

export class RenameFolderDto {
  @ApiProperty()
      name: string;
}
