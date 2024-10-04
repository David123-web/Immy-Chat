import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTutoringMaterialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        fileId: string; 

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
        shareWithStudent: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
        shareWithInstructor: boolean;
}