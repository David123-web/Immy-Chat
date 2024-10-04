import { ApiProperty } from '@nestjs/swagger';

export default class SelfChangePasswordDto {
    @ApiProperty()
        oldPassword: string;

    @ApiProperty()
        newPassword: string;
}
