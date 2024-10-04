import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
      name: string;
  @ApiPropertyOptional()
      description: string;
  @ApiPropertyOptional()
      hexColor: string;
}
