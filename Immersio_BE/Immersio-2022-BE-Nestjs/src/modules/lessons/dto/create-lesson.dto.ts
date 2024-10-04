import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
    @ApiProperty()
        courseSectionId: number;
    @ApiProperty()
        title: string;
    @ApiPropertyOptional()
        index: number;
    @ApiPropertyOptional()
        thumbnailId?: string;
    @ApiPropertyOptional()
        isFree?: boolean;
    @ApiPropertyOptional()
        instructionVideoId?: string;
    @ApiPropertyOptional()
        context?: string;
    @ApiPropertyOptional()
        introduction?: string;
    @ApiPropertyOptional()
        showIntroductionVideo?: boolean;
    @ApiPropertyOptional()
        showDialogSlide?: boolean;
}
