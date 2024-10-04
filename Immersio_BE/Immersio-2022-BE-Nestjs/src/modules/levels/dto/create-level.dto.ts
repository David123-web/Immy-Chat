import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty()
      name: string;
}
