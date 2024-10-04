import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ImportStep2Dto {
    @ApiProperty()
    @IsNumber()
        courseId: number;
}
