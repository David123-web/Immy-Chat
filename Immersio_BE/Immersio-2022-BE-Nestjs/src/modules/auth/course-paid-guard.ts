import {Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,} from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { CourseStudentService } from '../course-student/course-student.service';
import { UsersService } from '../users/users.service'; // Adjust the import path as needed
import { CourseType } from '@prisma/client';
import { Role } from '@prisma/client';

@Injectable()
export class CoursePaidGuard implements CanActivate {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly userService: UsersService,
        private readonly courseStudentService: CourseStudentService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const courseId = request.params.id;
        const subdomainId = request.subdomainId;

        const course = await this.coursesService.findOne(
            subdomainId,
            userId,
            courseId
        );
        if (course.courseType === CourseType.PAID) {
            const user = await this.userService.findById(userId);

            console.log(`User is ${JSON.stringify(user)}`);
            if (user.role === Role.STUDENT) {
                const hasPaid = await this.courseStudentService.hasPaid(userId, courseId);
                if (!hasPaid) {
                    throw new NotFoundException('Payment not found');
                }
            }
        }
        return true;
    }
}
