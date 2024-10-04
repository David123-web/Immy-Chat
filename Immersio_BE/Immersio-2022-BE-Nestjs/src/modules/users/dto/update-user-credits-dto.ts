import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserCreditsDto {
  @ApiProperty()
      availableCredits: number;

  @ApiProperty()
      bookedCredits: number;

  @ApiProperty()
      usedCredits: number;

  @ApiPropertyOptional()
      userId: string;
}