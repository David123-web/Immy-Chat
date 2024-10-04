import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLanguageDto {
    @ApiProperty()
    @IsString()
        code: string;

    @ApiProperty()
    @IsString()
        name: string;
}
