import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class PushNotificationDto {
    @ApiProperty()
        token: string[] | string;

    @ApiPropertyOptional()
        notification: any;

    @ApiPropertyOptional()
        data?: any;
}
