import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifySubdomainDto {
    @ApiProperty()
    @IsNotEmpty()
        token: string;
}
