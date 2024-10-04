import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CreateAvailableTimeDto } from '../../available-time/dto/create-available-time.dto';
import { AvailableTimeDto } from '../../available-time/dto/available-time.dto';

export class CreateRoomDto {
    @ApiProperty()
    @IsString()
        roomId: string;
    @ApiProperty()
        campusId: string;
    @ApiPropertyOptional({
        type: Array<number>,
        default: [0],
    })
    @IsArray()
        deleteAvailableTimeIds: number[];

    @ApiPropertyOptional({
        type: Array.of(AvailableTimeDto),
    })
    @IsArray()
        availableTimes: AvailableTimeDto[];
}
