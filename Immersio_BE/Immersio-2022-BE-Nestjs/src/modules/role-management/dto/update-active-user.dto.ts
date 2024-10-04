import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateActiveUserDto {
    @ApiProperty()
    @IsBoolean()
        isActive: boolean;
}
