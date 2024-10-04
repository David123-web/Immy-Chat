import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty()
      key: string;
  @ApiProperty()
      value: string;
}
