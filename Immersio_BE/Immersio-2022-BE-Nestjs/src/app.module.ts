import {CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';
import { ConfigModule } from '@nestjs/config';
import { FoldersModule } from './modules/folders/folders.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SendSMSHelper } from './helpers/send-sms';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CoursesModule } from './modules/courses/courses.module';
import { LevelsModule } from './modules/levels/levels.module';
import { TagsModule } from './modules/tags/tags.module';
import { CourseLanguagesModule } from './modules/course-languages/course-languages.module';
import { CountryModule } from './modules/countries/country.module';
import { LanguageModule } from './modules/languages/language.module';
import { TimeZoneModule } from './modules/time-zones/time-zone.module';
import { ProficiencyLevelsModule } from './modules/proficiency-levels/proficiency-levels.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { SectionsModule } from './modules/sections/sections.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ClassBookingModule } from './modules/class-booking/class-booking.module';
import { PhrasesModule } from './modules/phrases/phrases.module';
import { LogsModule } from './modules/user-logs/logs.module';
import { VocabulariesModule } from './modules/vocabularies/vocabularies.module';
import { GrammarsModule } from './modules/grammars/grammars.module';
import { DialogsModule } from './modules/dialogs/dialogs.module';
import { DialogLinesModule } from './modules/dialog-lines/dialog-lines.module';
import { DialogCharactersModule } from './modules/dialog-characters/dialog-characters.module';
import { DrillsModule } from './modules/drills/drills.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { SubdomainSettingsModule } from './modules/subdomain-settings/subdomain-settings.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SubdomainModule } from './modules/subdomain/subdomain.module';
import { CourseTrackingModule } from './modules/course-tracking/course-tracking.module';
import { RoleManagementModule } from './modules/role-management/role-management.module';
import { OnlinePaymentGatewaysModule } from './modules/online-payment-gateways/online-payment-gateways.module';
import { OfflinePaymentGatewaysModule } from './modules/offline-payment-gateways/offline-payment-gateways.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { JwtService } from '@nestjs/jwt';
import { GoogleDriveModule } from './modules/google-drive/google-drive.module';
import { TutoringModule } from './modules/tutoring/tutoring.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { VoiceRecordModule } from './modules/voice-record/voice-record.module';
import { FAQsModule } from './modules/faqs/faqs.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CampusesModule } from './modules/campuses/campuses.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubdomainPlansModule } from './modules/subdomain-plans/subdomain-plans.module';
import { AvailableTimeModule } from './modules/available-time/available-time.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { BannersModule } from './modules/banners/banners.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { RootSettingsModule } from './modules/root-settings/root-settings.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { KyselyModule } from 'nestjs-kysely';
import { CourseValidationModule } from './modules/course-validation/course-validation.module';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { UserAccountModule } from './business-services/user-account-services/user-account.module';
import { CourseStudentModule} from './modules/course-student/course-student.module';
import { SubdomainAndUserDetectMiddleware } from './helpers/check-valid-subdomain-and-user.middleware';
import { ClassSessionReportModule } from './modules/class-session-report/class-session-report.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        KyselyModule.forRoot({
            log: (event) => {
                console.log(
                    'Kysely',
                    event.query.sql,
                    event.queryDurationMillis
                );
            },
            dialect: new PostgresDialect({
                pool: new Pool({
                    connectionString: process.env.DATABASE_URL,
                }),
            }),
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        PrismaModule,
        AuthModule,
        UsersModule,
        FilesModule,
        FoldersModule,
        LessonsModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: parseInt(process.env.APP_REQ_IN_MIN),
        }),
        CoursesModule,
        LevelsModule,
        TagsModule,
        CourseLanguagesModule,
        CountryModule,
        LanguageModule,
        TimeZoneModule,
        SectionsModule,
        ProficiencyLevelsModule,
        PaymentModule,
        ClassBookingModule,
        VocabulariesModule,
        PhrasesModule,
        LogsModule,
        GrammarsModule,
        DialogsModule,
        DialogLinesModule,
        DialogCharactersModule,
        DrillsModule,
        SubscriptionPlansModule,
        SubdomainSettingsModule,
        SettingsModule,
        SubdomainModule,
        CourseTrackingModule,
        RoleManagementModule,
        OnlinePaymentGatewaysModule,
        OfflinePaymentGatewaysModule,
        // CreditsModule,
        FAQsModule,
        TransactionsModule,
        ContactsModule,
        // CreditPackagesModule,
        GoogleDriveModule,
        TutoringModule,
        NotificationsModule,
        VoiceRecordModule,
        ReviewsModule,
        CampusesModule,
        PlanModule,
        SubdomainPlansModule,
        AvailableTimeModule,
        BlogsModule,
        BannersModule,
        CouponsModule,
        RootSettingsModule,
        InvoiceModule,
        CourseValidationModule,
        ClassSessionReportModule,
        UserAccountModule,
        CourseStudentModule

    ],
    controllers: [AppController],
    providers: [
        JwtService,
        AppService,
        SendSMSHelper,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            // .apply(SubdomainDetectMiddleware)
            // .forRoutes({
            //     path: '*',
            //     method: RequestMethod.ALL,
            // })
            // .apply(UserStatusDetectMiddleware)
            // .forRoutes({
            //     path: '*',
            //     method: RequestMethod.ALL,
            // });
            .apply(SubdomainAndUserDetectMiddleware)
            .forRoutes({
                path: '*',
                method: RequestMethod.ALL,
            });
    }
}
