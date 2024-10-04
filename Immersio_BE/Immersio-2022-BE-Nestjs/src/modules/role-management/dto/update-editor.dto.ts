import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmailNotificationType, Role } from '@prisma/client';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export default class UpdateEditorDto extends UpdateUserDto {
    @ApiPropertyOptional()
    @IsArray()
    @IsEnum(EmailNotificationType, {
        each: true 
    })
    @IsOptional()
        emailNotificationOptions: Array<EmailNotificationType>;
}
