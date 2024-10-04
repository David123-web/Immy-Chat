import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class VerifyTokenDto {
    @ApiProperty()
    @IsNotEmpty()
        accessToken: string;
}
