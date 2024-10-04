import { Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query} from '@nestjs/common';
import { CourseValidationService } from './course-validation.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import  FindCourseDto  from '../courses/dto/find-course.dto';


@ApiTags('course-validation')
@Controller('course-validation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseValidationController {
    constructor(private readonly courseValidationService: CourseValidationService) {}

    @ApiResponse({
        status: 200,
        description: 'Get details course by id',
    })
    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: number) {
        return this.courseValidationService.validateCourse(req.subdomainId, req.user.id, id);
    }


}


