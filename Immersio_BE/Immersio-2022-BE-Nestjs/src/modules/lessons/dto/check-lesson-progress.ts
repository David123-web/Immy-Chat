import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';

export default class CheckLessonProgressDto {
    @ApiProperty()
        drillId: string;
    @ApiProperty()
        index: number;
    @ApiProperty()
        currentHealth: number;
    @ApiProperty()
        currentDiamond: number;
    @ApiProperty()
        isCorrect: boolean;
    @ApiProperty()
        isDone: boolean;
}
