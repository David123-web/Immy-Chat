import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DialogLine } from '@prisma/client';

export class CreateDialogDto {
    @ApiProperty()
        lessonId: number;

    @ApiPropertyOptional()
        thumbnailId?: string;

    @ApiPropertyOptional()
        index?: number;

    @ApiPropertyOptional()
        context?: string;

    @ApiPropertyOptional()
        contextAudioId?: string;

    @ApiPropertyOptional()
        introduction?: string;

    @ApiPropertyOptional()
        lines?: DialogLine[];

    @ApiProperty()
        medias: string[];
}
