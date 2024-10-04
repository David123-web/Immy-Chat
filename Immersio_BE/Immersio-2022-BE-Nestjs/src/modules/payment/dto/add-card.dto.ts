import { ApiProperty } from '@nestjs/swagger';

export class AddCardDto {
  @ApiProperty()
      name: string;

  @ApiProperty()
      exp_month: number;

  @ApiProperty()
      exp_year: number;

  @ApiProperty()
      number: string;

  @ApiProperty()
      cvc: string;

  @ApiProperty()
      paying_entity_id: string;
}
