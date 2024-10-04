import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DrillItemDto {
    @ApiProperty()
        id: string;

    @ApiPropertyOptional()
        index: number;

    @ApiProperty()
        question: string;

    @ApiPropertyOptional()
        content: string[];

    @ApiPropertyOptional()
        correctIndex: number;

    @ApiPropertyOptional()
        media: string;

    @ApiPropertyOptional()
        mediaUrl: string;
}
