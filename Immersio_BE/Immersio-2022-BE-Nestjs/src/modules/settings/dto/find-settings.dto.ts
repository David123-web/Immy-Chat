import { ApiProperty } from '@nestjs/swagger';

export class FindSettingsDto {
  @ApiProperty()
      subdomainId: string;
}
