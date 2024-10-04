import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class ChangeForgotPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
        newPassword: string;
}
