import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmailNotificationType, Role } from '@prisma/client';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export default class CreateCustomerServiceDto extends CreateUserDto {
    role = Role.CUSTOMER_SERVICE;

    @ApiPropertyOptional()
    @IsArray()
    @IsEnum(EmailNotificationType, {
        each: true 
    })
    @IsOptional()
        emailNotificationOptions: Array<EmailNotificationType>;
}
