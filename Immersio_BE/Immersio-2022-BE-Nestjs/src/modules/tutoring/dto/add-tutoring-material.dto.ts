import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddTutoringMaterialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        lessonId: number;

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