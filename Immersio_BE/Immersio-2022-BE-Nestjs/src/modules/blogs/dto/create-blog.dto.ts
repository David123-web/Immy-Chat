import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
    @ApiProperty()
        title: string;

    @ApiProperty()
        categoryId: string;

    @ApiProperty()
        author: string;

    @ApiProperty()
        content: string;

    @ApiPropertyOptional()
        metaDescription: string;

    @ApiPropertyOptional()
        metaKeywords: string[];

    @ApiPropertyOptional()
        isPublished: boolean;

    @ApiPropertyOptional()
        fileIds: string[];
}
