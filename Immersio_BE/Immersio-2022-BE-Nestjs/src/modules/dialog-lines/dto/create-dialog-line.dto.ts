import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDialogLineDto {
    @ApiProperty()
        dialogId: number;
    @ApiPropertyOptional()
        characterId:number;
    @ApiPropertyOptional()
        index:number;
    @ApiPropertyOptional()
        content: string;
    @ApiPropertyOptional({
        isArray: true
    })
        medias: string[];
}