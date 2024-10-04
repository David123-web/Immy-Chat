import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Lesson } from '@prisma/client';
import { CourseType } from '@prisma/client';


export class CreateCourseDto {
    @ApiProperty()
        slug: string;
    @ApiProperty()
        title: string;
    @ApiPropertyOptional()
        price: number;
    @ApiPropertyOptional()
        strikePrice?: number;
    @ApiPropertyOptional()
        courseLanguageId: number;

    @ApiProperty({
        default: CourseType.FREE,
        enum: CourseType
    })
        courseType: CourseType;
    @ApiPropertyOptional()
        learningOutcome: string;
    @ApiPropertyOptional()
        description: string;
    @ApiPropertyOptional()
        requirement: string;
    @ApiPropertyOptional()
        thumbnailId?: string;
    @ApiPropertyOptional()
        instructionVideoId: string;
    @ApiPropertyOptional()
        levelId: number;
    @ApiPropertyOptional()
        isFree: boolean;
    @ApiPropertyOptional()    
        isValid: boolean;   
    @ApiPropertyOptional()       
        warnings: string;                  
    @ApiPropertyOptional()
        isPublished: boolean;
    @ApiPropertyOptional({
        isArray: true,
    })
        lessons: Lesson[];
    @ApiPropertyOptional({
        isArray: true,
    })
        tagIds?: number[];
    @ApiPropertyOptional({
        isArray: true,
    })
        tutorIds?: number[];
    @ApiPropertyOptional({
        isArray: true,
    })
        courseTypes?: string[];
}
