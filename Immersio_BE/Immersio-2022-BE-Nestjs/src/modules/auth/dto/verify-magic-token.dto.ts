import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class VerifyMagicTokenDto {
    @ApiProperty()
    @IsNotEmpty()
        token: string;
}
