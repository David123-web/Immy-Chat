import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMailTestDto {
    @ApiProperty()
    @IsNotEmpty()
        to: string;

    @ApiProperty()
    @IsNotEmpty()
        subject: string;

    @ApiProperty()
    @IsNotEmpty()
        message: string;
}
