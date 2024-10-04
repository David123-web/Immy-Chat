import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
      tutorId: number;
  @ApiProperty()
      hours: number;
  @ApiProperty()
      rate: number;
  @ApiPropertyOptional()
      details: string;
}
