import { ApiProperty } from '@nestjs/swagger';
import { VoiceRecordType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddVoiceRecordDto {
    @ApiProperty()
    @IsNotEmpty()
        sendToUserId: string;
    
    @ApiProperty()
    @IsNotEmpty()
        dialogLineId: number;

    @ApiProperty()
    @IsNotEmpty()
        type: VoiceRecordType;

    @ApiProperty()
    @IsNotEmpty()
        fileId: string;

    @ApiProperty()
    @IsOptional()
        feedback: string;
}
