import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesService } from '../courses/courses.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { FilesService } from '../files/files.service';
import { SectionsService } from '../sections/sections.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { DialogLinesService } from '../dialog-lines/dialog-lines.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { CommonBusinessModule } from '../common-business/common-business.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '30 days',
            },
        }), 
        CommonBusinessModule
    ],
    controllers: [LessonsController],
    providers: [
        LessonsService,
        NotificationsService,
        FilesService,
        SectionsService,
        CoursesService,
        DialogsService,
        DialogLinesService,
        SubdomainSettingsService,
    ],
    exports: [LessonsService],
})
export class LessonsModule {}
