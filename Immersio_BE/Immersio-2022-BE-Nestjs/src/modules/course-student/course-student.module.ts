import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsService } from '../notifications/notifications.service';
import { FilesService } from '../files/files.service';
import { SectionsService } from '../sections/sections.service';
import { LessonsModule } from '../lessons/lessons.module';
import { DialogsService } from '../dialogs/dialogs.service';
import { DialogLinesService } from '../dialog-lines/dialog-lines.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { UsersService } from '../users/users.service';
import { RoleManagementService } from '../role-management/role-management.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { CourseStudentController } from './course-student.controller';
import { CourseStudentService } from './course-student.service';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports: [
        PrismaModule,
        LessonsModule,
    ],
    controllers: [CourseStudentController],
    providers: [
        CourseStudentService,
        NotificationsService,
        FilesService,
        SectionsService,
        DialogsService,
        DialogLinesService,
        SubdomainSettingsService,
        UsersService,
        RoleManagementService,
        TimeZoneService,
        JwtService
    ],
    exports: [CourseStudentService],
})
export class CourseStudentModule {}
