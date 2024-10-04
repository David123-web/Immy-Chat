import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class BiometricLoginDto {
    @ApiProperty()
    @IsNotEmpty()
        signature: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;
}
