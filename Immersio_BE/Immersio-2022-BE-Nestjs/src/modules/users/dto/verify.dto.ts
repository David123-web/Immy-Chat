import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class VerifyDto {
    @IsEmail()
    @ApiProperty()
        email: string;

    @ApiProperty()
        verified: boolean;
}
