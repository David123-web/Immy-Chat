import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CheckEmailDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;
}
