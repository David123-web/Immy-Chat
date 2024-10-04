import { ApiProperty } from '@nestjs/swagger';

export class CreateFAQCategoryDto {
    @ApiProperty()
        name: string;
    
    @ApiProperty()
        active: boolean;
}
