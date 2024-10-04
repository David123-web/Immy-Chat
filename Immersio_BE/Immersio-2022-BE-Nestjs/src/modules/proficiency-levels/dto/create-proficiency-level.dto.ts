import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProficiencyLevelDto {
    @ApiProperty()
    @IsString()
        code: string;
    
    @ApiProperty()
    @IsString()
        name: string;
}
