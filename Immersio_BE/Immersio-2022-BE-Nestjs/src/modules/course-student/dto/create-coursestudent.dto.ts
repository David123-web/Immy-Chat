import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseStudentDto {
    @ApiProperty()
        courseId: number;
    @ApiPropertyOptional()
        studentId?: number;
    @ApiProperty()
        userId: string;
    @ApiProperty()
        purchased: boolean;
    @ApiProperty()
        active: boolean;
    @ApiProperty()
        subdomainId: string;
}