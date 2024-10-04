import { ApiProperty } from '@nestjs/swagger';

export class InviteCoInstructorDto {
    @ApiProperty()
        courseId: number;

    @ApiProperty()
        instructorId: number;
}
