import { Controller, Get, Query, Req, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CourseStudentService } from './course-student.service';
import { CreateCourseStudentDto } from './dto/create-coursestudent.dto';


@ApiTags('course-student')
@Controller('course-student')
export class CourseStudentController {
    constructor(private readonly courseStudentService: CourseStudentService) { }
    @ApiResponse({
        status: 200,
        description: 'Create course',
    })
    @ApiResponse({
        status: 202,
        description: 'Nothing to do',
    })
    @ApiResponse({
        status: 500,
        description: 'Assignment to Course Failed',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async assign(@Req() req: any, @Body() createCourseStudentDto: CreateCourseStudentDto) {
        createCourseStudentDto.userId = req.user.id;
        createCourseStudentDto.subdomainId = req.subdomainId;
        if( await this.courseStudentService.isAssignedToCourse(createCourseStudentDto.userId, createCourseStudentDto.courseId)){
            throw new HttpException('Student already assigned to course', HttpStatus.ACCEPTED); 
        }
        const result =   await this.courseStudentService.assignStudentToCourse(createCourseStudentDto);
        if (!result) {
            throw new HttpException('Error assigning student to course', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
}
