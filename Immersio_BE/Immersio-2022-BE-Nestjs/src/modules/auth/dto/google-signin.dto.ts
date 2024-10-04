import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class ThirdPartySignInDto {
    @ApiProperty()
    @IsNotEmpty()
        token: string;
}
