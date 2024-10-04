import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export default class UpdateUserStatusDto {
    @ApiProperty()
    @IsEnum(UserStatus)
        status: UserStatus;
}
