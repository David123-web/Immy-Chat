import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmailNotificationType, Role } from '@prisma/client';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export default class CreateEditorDto extends CreateUserDto {
    role = Role.EDITOR;

    @ApiPropertyOptional()
    @IsArray()
    @IsEnum(EmailNotificationType, {
        each: true 
    })
    @IsOptional()
        emailNotificationOptions: Array<EmailNotificationType>;
}
