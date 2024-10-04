import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,} from '@nestjs/common';
import { Put, Query } from '@nestjs/common/decorators';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CourseTrackingService } from './course-tracking.service';
import { CompleteCourseDto } from './dto/complete-course.dto';
import { SubdomainHeader } from 'src/helpers/common';

@Controller('course-tracking')
@ApiTags('course-tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader(SubdomainHeader)
export class CourseTrackingController {
    constructor(
        private readonly courseTrackingService: CourseTrackingService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Get all course trackings by course id and lesson id',
    })
    @Get(':courseId/lessons/:lessonId')
    findAll(
        @Req() req: any,
        @Param('courseId') courseId: number,
        @Param('lessonId') lessonId: number
    ) {
        return this.courseTrackingService.findByCourseAndLesson(
            req.user.id,
            courseId,
            lessonId
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get details course tracking by course id',
    })
    @Get(':courseId')
    findOne(@Req() req: any, @Param('courseId') courseId: number) {
        return this.courseTrackingService.findByCourse(req.user.id, courseId);
    }

    @ApiResponse({
        status: 200,
        description: 'Update complete course tracking',
    })
    @Put('complete')
    complete(
        @Req() req: any,
        @Body() updateCourseTrackingDto: CompleteCourseDto
    ) {
        return this.courseTrackingService.complete(
            req.user.id,
            updateCourseTrackingDto
        );
    }
}
