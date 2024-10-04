import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { StripeHelper } from '../../helpers/stripe';
import { RoleManagementService } from '../role-management/role-management.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        NotificationsService,
        JwtService,
        FilesService,
        StripeHelper,
        RoleManagementService,
        TimeZoneService,
        SubdomainSettingsService,

    ],
    exports: [UsersService],
})
export class UsersModule {}
