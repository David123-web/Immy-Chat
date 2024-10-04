import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateClassSessionReportDto {
    @ApiProperty()
    @IsNotEmpty()
        classBookingId: number;

    @ApiProperty()
        creditCost: number;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        startTime: Date;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
        finishTime: Date;
}
