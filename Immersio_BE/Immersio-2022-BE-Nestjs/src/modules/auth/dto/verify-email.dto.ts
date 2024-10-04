import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class VerifyEmailDto {
    @ApiProperty()
    @IsNotEmpty()
        token: string;
}
