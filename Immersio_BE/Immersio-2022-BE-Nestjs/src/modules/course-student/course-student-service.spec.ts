import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { StripeHelper } from 'src/helpers/stripe';
import { ConfigService } from '@nestjs/config';
import { RoleManagementService } from 'src/modules/role-management/role-management.service';
import { SubdomainSettingsService } from 'src/modules/subdomain-settings/subdomain-settings.service';
import { CourseStudentService } from './course-student.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { FilesService } from 'src/modules/files/files.service';
import { LessonsService } from 'src/modules/lessons/lessons.service';
import { DialogsService } from 'src/modules/dialogs/dialogs.service';
import { DialogLinesService } from 'src/modules/dialog-lines/dialog-lines.service';
import { SectionsService } from 'src/modules/sections/sections.service';
import { InvoiceService } from 'src/modules/invoices/invoice.service';
import { ClassBookingService } from 'src/modules/class-booking/class-booking.service';
import { TimeZoneService } from 'src/modules/time-zones/time-zone.service';
import { ClassSessionReportService } from 'src/modules/class-session-report/class-session-report.service';
import { SubscriptionPlansService } from 'src/modules/subscription-plans/subscription-plans.service';
import { PaypalHelper } from 'src/helpers/paypal';
import { SubscriptionsService } from 'src/modules/subscription/subscriptions.service';
import { CoursesService } from '../courses/courses.service';

import { CommonBusinessModule } from '../common-business/common-business.module';

import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';


describe('Course Student', () => {
    let courseStudentService: CourseStudentService;

    beforeEach(async () => {
        const courseModule: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
                CommonBusinessModule,
                KyselyModule.forRoot({
                    dialect: new PostgresDialect({
                        pool: new Pool({
                            connectionString: process.env.DATABASE_URL,
                        }),
                    }),
                }),
            ],
            providers: [
                AuthService,
                UsersService,
                JwtService,
                PrismaService,
                StripeHelper,
                ConfigService,
                RoleManagementService,
                SubdomainSettingsService,
                CourseStudentService,
                NotificationsService,
                FilesService,
                LessonsService,
                DialogsService,
                DialogLinesService,
                SectionsService,
                InvoiceService,
                ClassBookingService,
                TimeZoneService,
                ClassSessionReportService,
                SubscriptionPlansService,
                PaypalHelper,
                SubscriptionsService, 
                CoursesService
            ],
        }).compile();

        courseStudentService = courseModule.get<CourseStudentService>(CourseStudentService);
    });

    it('should be defined', () => {
        expect(CourseStudentService).toBeDefined();
    });

    it('should create a new course student relation', async () => {

        const createCourseStudentDto = {
            courseId: 301,
            studentId: 24,
            userId: 'clp27xcwt000rx1p73mxio270',
            purchased: true,
            active: true,
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3'
        };



        const result = await courseStudentService.assignStudentToCourse(
            createCourseStudentDto
        );
        courseStudentService._deletedCourseStudent(createCourseStudentDto.userId, createCourseStudentDto.courseId);
        expect(result).toBeDefined();  
        const createdDate:Date = result.createdAt;
        const today = new Date();
        expect(createdDate.getFullYear()).toEqual(today.getFullYear());
        expect(createdDate.getMonth()).toEqual(today.getMonth());
        expect(createdDate.getDate()).toEqual(today.getDate());
        console.log(`studentcourse ${JSON.stringify(result, null, 8)}`);  
    });

    it('should know when a student is already assigned', async () => {

        const createCourseStudentDto = {
            courseId: 301,
            studentId: 23,
            userId: 'clp27n1hj000px1p73kk1m9yr',
            purchased: true,
            active: true,
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3'
        };



        const result = await courseStudentService.isAssignedToCourse(
            createCourseStudentDto.userId, createCourseStudentDto.courseId
        );
        expect(result).toBe(true);  

    });

    it('should update a course student relation', async () => {

        const createCourseStudentDto = {
            courseId: 301,
            studentId: 23,
            userId: 'clp27n1hj000px1p73kk1m9yr',
            purchased: false,
            active: true,
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3'
        };

        const result = await courseStudentService.assignStudentToCourse(
            createCourseStudentDto
        );
        expect(result).toBeDefined();  
        console.log(`UPDATE RESULT ${JSON.stringify(result, null, 6)}`) 
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const createdDate:Date = result.createdAt;
        console.log(`now ${today.getTime()}`);
        console.log(`created ${createdDate.getTime()}`);
        expect(createdDate).toBeInstanceOf(Date);
        expect(createdDate.getTime()).toBeLessThan((today.getTime() - 30000));
    });

   
    
});
