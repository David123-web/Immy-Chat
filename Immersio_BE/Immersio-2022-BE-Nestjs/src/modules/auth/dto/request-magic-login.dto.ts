import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class RequestMagicLoginDto {
    @ApiProperty()
    @IsNotEmpty()
        email: string;
}
