

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProficiencyLevelDto {
  @ApiProperty()
  @IsString()
      name: string;
}
