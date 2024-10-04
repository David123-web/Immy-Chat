import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogCategoryDto {
    @ApiProperty()
        name: string;
    
    @ApiProperty()
        active: boolean;
}
