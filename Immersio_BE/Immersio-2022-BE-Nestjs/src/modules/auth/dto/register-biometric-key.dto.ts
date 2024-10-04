import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class RegisterBiometricKeyDto {
    @ApiProperty()
    @IsNotEmpty()
        public_key: string;
}
