import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCountryDto {
  @ApiProperty()
  @IsString()
      name: string;
}
