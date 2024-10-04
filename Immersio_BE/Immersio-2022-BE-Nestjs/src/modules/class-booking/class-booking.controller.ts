import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,} from '@nestjs/common';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ClassBookingService } from './class-booking.service';
import { CreateClassBookingDto } from './dto/create-class-booking.dto';
import { UpdateClassBookingDto } from './dto/update-class-booking.dto';
import { SearchParamsDto, SearchParamsOnlyDto } from '../../common/dto';
import { SubmitBookingRequestDto } from './dto/submit-booking-request.dto';
import { GetClassesTimeDto } from './dto/get-classes-time.dto';
import { AcceptBookingRequestDto } from './dto/accept-booking-request.dto';
import { RejectBookingRequestDto } from './dto/reject-booking-request.dto';
import { GetBookingRequestsTutorDto } from './dto/get-booking-requests-tutor.dto';
import { SubmitLessonCompleteDto } from './dto/lesson-complete.dto';

@ApiTags('class-booking')
@Controller('class-booking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassBookingController {
    constructor(private readonly classBookingService: ClassBookingService) {}

    @ApiResponse({
        status: 200,
        description: 'Create a new class booking',
    })
    @Post()
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.SUBDOMAIN_ADMIN)
    create(
        @Req() req: any,
        @Body() createClassBookingDto: CreateClassBookingDto
    ) {
        const role = req.user.role;
        const userId = req.user.id;
        return this.classBookingService.create(
            userId,
            role,
            createClassBookingDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get all class bookings with pagination',
    })
    @Get('classes')
    getClasses(@Req() req: any, @Query() search: SearchParamsDto) {
        const role = req.user.role;
        const userId = req.user.id;
        const subdomainId = req.subdomainId;
        return this.classBookingService.getClasses(
            userId,
            role,
            subdomainId,
            search
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Update a class booking',
    })
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.SUBDOMAIN_ADMIN)
    @Patch('class/:id')
    updateClass(
        @Param('id') id: number,
        @Req() req: any,
        @Body() updateClassBookingDto: UpdateClassBookingDto
    ) {
        const role = req.user.role;
        const userId = req.user.id;

        return this.classBookingService.updateClass(
            id,
            role,
            userId,
            updateClassBookingDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Delete a class booking',
    })
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.SUBDOMAIN_ADMIN)
    @Delete('class/:id')
    deleteClass(@Req() req: any, @Param('id') id: number) {
        const role = req.user.role;
        const userId = req.user.id;
        return this.classBookingService.deleteClass(id, role, userId);
    }

    @ApiResponse({
        status: 200,
        description: 'Get detail class booking',
    })
    @Get('class/:id')
    getDetailClass(@Param('id') id: number) {
        return this.classBookingService.getDetailClass(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Submit booking request',
    })
    @Roles(Role.STUDENT)
    @Post('/class/booking')
    submitBookingRequest(
        @Req() req: any,
        @Body() body: SubmitBookingRequestDto
    ) {
        const userId = req.user.id;
        return this.classBookingService.submitBookingRequest(userId, body);
    }

    @ApiResponse({
        status: 200,
        description:
            'Get tutors of students, searchBy = teachLanguages | countryCode | startTime',
    })
    @Roles(Role.STUDENT)
    @Get('tutors')
    getTutorsOfStudents(@Req() req: any, @Query() search: SearchParamsOnlyDto) {
        return this.classBookingService.getTutorsOfStudents(
            req.user.id,
            search
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get classes of tutors students can view',
    })
    @Get('tutors/:id/classes')
    @Roles(Role.STUDENT)
    getClassesOfTutors(@Req() req: any, @Param('id') tutorId: number) {
        const userId = req.user.id;
        return this.classBookingService.getClassesOfTutors(userId, tutorId);
    }

    @ApiResponse({
        status: 200,
        description: 'Get classes of students can view with time',
    })
    @Roles(Role.STUDENT)
    @Get('calendar/student')
    studentGetClassesTime(@Req() req: any, @Query() search: GetClassesTimeDto) {
        return this.classBookingService.studentGetClassesTime(
            req.user.id,
            search
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get classes of tutors can view with time',
    })
    @Roles(Role.TUTOR)
    @Get('calendar/tutor')
    tutorGetClassesTime(@Req() req: any, @Query() search: GetClassesTimeDto) {
        return this.classBookingService.tutorGetClassTime(req.user.id, search);
    }

    @ApiResponse({
        status: 200,
        description: 'Accept booking request',
    })
    @Roles(Role.TUTOR)
    @Post('booking/accept')
    acceptBookingRequest(
        @Req() req: any,
        @Body() body: AcceptBookingRequestDto
    ) {
        return this.classBookingService.acceptBookingRequest(
            req.user.id,
            body.requestId
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Accept booking request',
    })
    @Roles(Role.TUTOR)
    @Post('booking/reject')
    rejectBookingRequest(
        @Req() req: any,
        @Body() body: RejectBookingRequestDto
    ) {
        return this.classBookingService.rejectBookingRequest(
            req.user.id,
            body.requestId
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get detail booking request',
    })
    @Roles(Role.TUTOR, Role.STUDENT)
    @Get('booking/request/:id')
    getDetailBookingRequest(@Req() req: any, @Param('id') id: number) {
        return this.classBookingService.getDetailBookingRequest(
            req.user.id,
            id
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get detail booking request for tutor',
    })
    @Roles(Role.TUTOR)
    @Get('booking/requests/tutor')
    getDetailBookingRequestForTutor(
        @Req() req: any,
        @Query() search: GetBookingRequestsTutorDto
    ) {
        return this.classBookingService.getDetailBookingRequestForTutor(
            req.user.id,
            search
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Submit lesson complete',
    })
    @Roles(Role.TUTOR)
    @Post('lesson/complete')
    submitLessonComplete(
        @Req() req: any,
        @Body() body: SubmitLessonCompleteDto
    ) {
        return this.classBookingService.submitLessonComplete(
            req.subdomainId,
            req.user.id,
            body
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get lesson complete',
    })
    @Get('lesson/complete/:classId')
    getLessonComplete(@Req() req: any, @Param('classId') classId: number) {
        return this.classBookingService.getLessonsCompleted(classId);
    }
}
