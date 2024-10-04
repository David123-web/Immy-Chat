import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class GetRoomByIdDto {
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        start: Date;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        end: Date;
}
