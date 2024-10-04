import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailTemplateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        subject: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        content: string;
}
