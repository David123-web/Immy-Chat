import { ApiProperty } from '@nestjs/swagger';

export class RenameFileDto {
  @ApiProperty()
      name: string;
}
