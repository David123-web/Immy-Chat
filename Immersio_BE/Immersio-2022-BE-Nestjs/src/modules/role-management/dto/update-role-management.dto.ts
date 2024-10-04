import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateRoleManagementDto {
    @ApiProperty()
    @IsObject()
        value: object;
}
