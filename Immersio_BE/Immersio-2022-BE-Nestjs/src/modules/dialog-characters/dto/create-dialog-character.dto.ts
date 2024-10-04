import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CreateDialogCharacterDto {
    @ApiProperty()
        name: string;
    @ApiPropertyOptional()
        age: number;
    @ApiPropertyOptional()
        gender: Gender;
    @ApiPropertyOptional()
        occupation: string;
}