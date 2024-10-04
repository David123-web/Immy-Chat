import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendShareEmailDto {
  @ApiProperty()
      fileId: string;

  @IsEmail()
  @ApiProperty()
      email: string;
}
