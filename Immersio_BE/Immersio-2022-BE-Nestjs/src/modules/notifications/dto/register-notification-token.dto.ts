import { ApiProperty } from '@nestjs/swagger';

export class RegisterNotificationTokenDto {
    @ApiProperty()
        deviceId: string;

    @ApiProperty()
        token: string;
}
