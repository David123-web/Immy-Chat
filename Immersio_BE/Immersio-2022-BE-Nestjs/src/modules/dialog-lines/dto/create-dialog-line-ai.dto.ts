import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDialogLineAIDataDto {
    @ApiProperty()
        alternativeAnswers: string[];
}