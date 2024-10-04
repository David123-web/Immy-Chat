import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampusStatus } from '@prisma/client';

export class UpdateCampusDto {
    @ApiProperty()
        name: string;
    @ApiPropertyOptional()
        dialogCode: string;
    @ApiPropertyOptional()
        phoneNumber: string;
    @ApiPropertyOptional()
        managerName: string;
    @ApiProperty({
        enum: CampusStatus 
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
    @ApiProperty()
        countryCode: string;
}
