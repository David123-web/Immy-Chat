import { ApiProperty } from '@nestjs/swagger';

export class CreateFAQDto {
  @ApiProperty()
      categoryId: string;
  @ApiProperty()
      question: string;
  @ApiProperty()
      answer: string;
}
