import { Module } from '@nestjs/common';
import { ClassBookingService } from './class-booking.service';
import { ClassBookingController } from './class-booking.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RoleManagementModule } from '../role-management/role-management.module';
import { RoleManagementService } from '../role-management/role-management.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { ClassSessionReportService } from '../class-session-report/class-session-report.service';

@Module({
    controllers: [ClassBookingController],
    providers: [
        ClassBookingService,
        RoleManagementService,
        NotificationsService,
        TimeZoneService,
        ClassSessionReportService,
    ],
    imports: [PrismaModule, JwtModule],
    exports: [ClassBookingService]
})
export class ClassBookingModule {}
