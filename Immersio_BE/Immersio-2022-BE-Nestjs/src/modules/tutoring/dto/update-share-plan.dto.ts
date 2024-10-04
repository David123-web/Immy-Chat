import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateSharePlanDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
        isShared: boolean;
}