import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetListRecordsDto {
    @ApiProperty()
    @IsNotEmpty()
        sendToUserId: string;
    
    @ApiProperty()
    @IsNotEmpty()
        dialogId: number;
}