import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCountryDto {
    @ApiProperty()
    @IsString()
        code: string;

    @ApiProperty()
    @IsString()
        dialCode: string;

    @ApiProperty()
    @IsString()
        name: string;
}
