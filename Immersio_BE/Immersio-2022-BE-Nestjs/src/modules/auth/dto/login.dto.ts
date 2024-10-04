import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class LoginDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @ApiProperty()
    @IsNotEmpty()
        password: string;
}
