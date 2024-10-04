import { ApiProperty } from '@nestjs/swagger';

export class CreateContactMessageDto {
    @ApiProperty()
        name: string;

    @ApiProperty()
        email: string;

    @ApiProperty()
        subject: string;

    @ApiProperty()
        message: string;
}
