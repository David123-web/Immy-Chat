import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';


export class CreateNotificationDto {
    @ApiProperty({
        enum: NotificationType 
    })
        type: NotificationType;

    @ApiPropertyOptional()
        title: string;

    @ApiPropertyOptional()
        refId?: string;

    @ApiPropertyOptional()
        body: string;

    @ApiPropertyOptional()
        metadata: any;
}
