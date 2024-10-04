import { Module } from '@nestjs/common';


import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { StripeHelper } from '../../helpers/stripe';
import { RoleManagementService } from '../role-management/role-management.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { SubdomainPlansService } from '../subdomain-plans/subdomain-plans.service';
import { SubdomainService } from '../subdomain/subdomain.service';
import { SubscriptionsService } from '../subscription/subscriptions.service';
import { SubscriptionPlansService } from '../subscription-plans/subscription-plans.service';
import { UsersService } from '../users/users.service';
import { PaypalHelper } from 'src/helpers/paypal';
import { ClassBookingService } from '../class-booking/class-booking.service';
import { ClassSessionReportService } from '../class-session-report/class-session-report.service';
import { InvoiceService } from '../invoices/invoice.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '30 days',
            },
        }),
    ],
    controllers: [],
    providers: [
        UsersService,
        NotificationsService,
        JwtService,
        FilesService,
        StripeHelper,
        RoleManagementService,
        TimeZoneService,
        SubdomainSettingsService,
        SubdomainService,
        SubdomainPlansService,
        PaypalHelper, 
        SubscriptionsService,
        SubscriptionPlansService,
        ClassBookingService,
        PrismaService,
        ClassSessionReportService,
        InvoiceService,
        ConfigService,

    ],
    exports: [
        UsersService,
        NotificationsService,
        JwtService,
        FilesService,
        StripeHelper,
        RoleManagementService,
        TimeZoneService,
        SubdomainSettingsService,
        SubdomainService,         
        SubdomainPlansService,
        PaypalHelper, 
        SubscriptionsService, 
        SubscriptionPlansService,
        ClassBookingService,
        PrismaService,
        ClassSessionReportService,
        InvoiceService,
        ConfigService,

    ],
})
export class CommonBusinessModule {}