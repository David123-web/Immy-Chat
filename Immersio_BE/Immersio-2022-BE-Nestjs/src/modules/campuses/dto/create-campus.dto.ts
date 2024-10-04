import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampusStatus, Lesson, Room } from '@prisma/client';
import { CreateRoomDto } from './create-room.dto';

export class CreateCampusDto {
    @ApiProperty()
        name: string;
    @ApiPropertyOptional()
        dialogCode: string;
    @ApiPropertyOptional()
        phoneNumber: string;
    @ApiPropertyOptional()
        managerName: string;
    @ApiProperty({
        enum: CampusStatus,
    })
        status: CampusStatus;
    @ApiProperty()
        address: string;
    @ApiPropertyOptional()
        zipCode: string;
    @ApiPropertyOptional()
        city: string;
    @ApiPropertyOptional()
        state: string;
    @ApiPropertyOptional()
        countryCode: string;
    @ApiPropertyOptional({
        isArray: true,
        type: CreateRoomDto,
    })
        rooms: CreateRoomDto[];
}
