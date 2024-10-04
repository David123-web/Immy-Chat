import { Module } from '@nestjs/common';
import { CourseValidationService } from './course-validation.service';
import { CourseValidationController } from './course-validation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesService } from '../courses/courses.service';
import { LessonsService } from '../lessons/lessons.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { FilesService } from '../files/files.service';
import { SectionsService } from '../sections/sections.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { DialogLinesService } from '../dialog-lines/dialog-lines.service';
import { VocabulariesService } from '../vocabularies/vocabularies.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { CommonBusinessModule } from '../common-business/common-business.module';
import { CommonCourseModule } from '../common-course/common-course.module';
@Module({
    imports: [
        CommonCourseModule,
        CommonBusinessModule,
        PrismaModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '30 days',
            },
            
        }),
    ],
    controllers: [CourseValidationController],
    providers: [
        CourseValidationService,  
    ],
})
export class CourseValidationModule {}


