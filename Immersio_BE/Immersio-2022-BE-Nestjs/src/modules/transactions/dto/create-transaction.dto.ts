import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty()
      userId: string;
  @ApiProperty({
      enum: TransactionType
  })
      type: TransactionType;
  @ApiProperty()
      amount: number;
  @ApiProperty()
      createdAt: string;
}