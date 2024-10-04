import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDialogLineAIDataDto {
    @ApiProperty()
        alternativeAnswers: string[];
}