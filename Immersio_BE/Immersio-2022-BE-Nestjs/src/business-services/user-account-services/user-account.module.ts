import { Module } from '@nestjs/common';
import { UserAccountService } from './user-account.service';

import { CoursesModule } from 'src/modules/courses/courses.module';
import { CommonBusinessModule } from 'src/modules/common-business/common-business.module';
import { CourseStudentModule } from 'src/modules/course-student/course-student.module';
@Module({
    imports: [
        CommonBusinessModule, 
        CoursesModule, 
        CourseStudentModule,
    ],

    controllers: [],
    providers: [UserAccountService]
})
export class UserAccountModule {}
