import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UserAccountService } from 'src/business-services/user-account-services/user-account.service';
import { PaymentController } from './payment.controller';
import { StripeHelper } from 'src/helpers/stripe';
import { PrismaModule } from '../prisma/prisma.module';
import { StripePaymentService } from './stripe.service';
import { PaypalPaymentService } from './paypal.service';
import { VnpayPaymentService } from './vnpay.service';
import { PaypalHelper } from 'src/helpers/paypal';
import { UsersService } from 'src/modules/users/users.service';
import { CoursesService } from 'src/modules/courses/courses.service';
import { InvoiceService } from 'src/modules/invoices/invoice.service';
import { ClassBookingService } from 'src/modules/class-booking/class-booking.service';
import { RoleManagementService } from '../role-management/role-management.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';
import { FilesService } from '../files/files.service';
import { SectionsService } from '../sections/sections.service';
import { LessonsService } from '../lessons/lessons.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { DialogLinesService } from '../dialog-lines/dialog-lines.service';
import { ClassSessionReportService } from '../class-session-report/class-session-report.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { UserAccountModule } from 'src/business-services/user-account-services/user-account.module';
import { SubscriptionPlansService } from '../subscription-plans/subscription-plans.service';
import { SubscriptionsService } from '../subscription/subscriptions.service';
import { CourseStudentService } from '../course-student/course-student.service';
@Module({
    imports: [PrismaModule],
    controllers: [PaymentController],
    providers: [
        PaymentService,
        StripePaymentService,
        PaypalPaymentService,
        VnpayPaymentService,
        StripeHelper,
        PaypalHelper,
        UserAccountService,
        UsersService,
        CoursesService,
        InvoiceService,
        ClassBookingService,
        RoleManagementService,
        SubdomainSettingsService,
        JwtService,
        NotificationsService,
        FilesService,
        SectionsService,
        LessonsService,
        DialogsService,
        DialogLinesService,
        ClassSessionReportService,
        TimeZoneService,
        UserAccountModule,
        UsersService,
        SubscriptionPlansService,
        SubscriptionsService,
        CourseStudentService
    ],
})
export class PaymentModule {}
