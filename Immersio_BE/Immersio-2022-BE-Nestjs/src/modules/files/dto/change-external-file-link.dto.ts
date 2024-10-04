import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeExternalFileLinkDto {
  @ApiProperty()
      link: string;
}
