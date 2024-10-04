import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
        password: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
        oldPassword: string;
}
