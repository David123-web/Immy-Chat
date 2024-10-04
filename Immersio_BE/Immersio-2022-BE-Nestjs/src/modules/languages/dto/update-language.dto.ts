
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLanguageDto {
  @ApiProperty()
  @IsString()
      name: string;
}
