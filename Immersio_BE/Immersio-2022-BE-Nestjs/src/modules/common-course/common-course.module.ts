import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { FilesService } from '../files/files.service';
import { SectionsService } from '../sections/sections.service';
import { LessonsService } from '../lessons/lessons.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { DialogLinesService } from '../dialog-lines/dialog-lines.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { UsersService } from '../users/users.service';
import { RoleManagementService } from '../role-management/role-management.service'; 
import { TimeZoneService } from '../time-zones/time-zone.service';
import { CoursesService } from '../courses/courses.service';
import { VocabulariesService } from '../vocabularies/vocabularies.service'; 
import { CourseStudentService } from '../course-student/course-student.service';

@Module({
    imports: [        
        PrismaModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '30 days',
            },
        }),],
    controllers: [],
    providers: [
        CoursesService,
        NotificationsService,
        FilesService,
        SectionsService,
        DialogsService,
        DialogLinesService,
        SubdomainSettingsService,
        UsersService,
        RoleManagementService,
        TimeZoneService,
        LessonsService,
        VocabulariesService,
        PrismaService,
        JwtService,
        CourseStudentService
    ],
    exports: [
        CoursesService,
        NotificationsService,
        FilesService,
        SectionsService,
        DialogsService,
        DialogLinesService,
        SubdomainSettingsService,
        UsersService,
        RoleManagementService,
        TimeZoneService,
        LessonsService,
        VocabulariesService,
        PrismaService,
        JwtService,
        CourseStudentService
    ],
})
export class CommonCourseModule {}