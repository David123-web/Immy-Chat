import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { StripeHelper } from 'src/helpers/stripe';
import { ConfigService } from '@nestjs/config';
import { UserAccountService } from './user-account.service';
import { RoleManagementService } from 'src/modules/role-management/role-management.service';
import { SubdomainSettingsService } from 'src/modules/subdomain-settings/subdomain-settings.service';
import { CoursesService } from 'src/modules/courses/courses.service';
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
import { CourseStudentService } from 'src/modules/course-student/course-student.service';


import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { ProductTypes } from 'src/constants/business-constants';
import { PaymentMethod } from '@prisma/client';

describe('Credit Management Purchase Class', () => {
    let userAccountService: UserAccountService;

    beforeEach(async () => {
        const serviceModule: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
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
                UserAccountService,
                RoleManagementService,
                SubdomainSettingsService,
                CoursesService,
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
                CourseStudentService,
            ],
        }).compile();

        userAccountService = serviceModule.get<UserAccountService>(UserAccountService);
    });

    it('should be defined', () => {
        expect(userAccountService).toBeDefined();
    });

    it('should move credits to booked when class purchased with credits', async () => {

        const productPurchaseDto = {
            productId: 'rtyuiop',
            unitCount: 0,
            productType: ProductTypes.CLASS,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 10,
            purchaseId: '',
          
        };


        const purchaseWithCreditDto = {

            subdomainId: 'cldw3p0dy000ds6c07xpgaxps',
            purchaserId: 'cles4v5jr000nmc0t47mb5o49',
            userId: 'cles4v5jr000nmc0t47mb5o49', //test199@mailinator.com
            totalCreditsSpent: 10,
            paymentMethod: PaymentMethod.IMMERSIO_CREDIT,
            products: [productPurchaseDto],

        };
        const results = await userAccountService.purchaseWithCredit(
            purchaseWithCreditDto
        );
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach( p => {
            expect(p.creditProcessingComplete).toEqual(true);
            expect(p.creditProcessingMessage).toEqual('SUCCESS');
        });
        

    });


    it('should fail when class purchased direct from payment', async () => {
        const productPurchaseDto = {
            productId: 'rtyuiop',
            unitCount: 0,
            productType: ProductTypes.CLASS,
            creditProcessingComplete: false,
            creditsSpent: 10,
            creditProcessingMessage: '',
            purchaseId: '',
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3p0dy000ds6c07xpgaxps',
            purchaserId: 'cles4v5jr000nmc0t47mb5o49',
            userId: 'cles4v5jr000nmc0t47mb5o49', //test199@mailinator.com
            totalCreditsSpent: 10,
            paymentMethod: PaymentMethod.STRIPE,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(
            purchaseWithCreditDto
        );
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(false);
            expect(p.creditProcessingMessage).toContain('NO_DIRECT_PURCHASE');
        });
    });


    it('should fail when user has insufficient credits', async () => {
        const productPurchaseDto = {
            productId: 'rtyuiop',
            unitCount: 0,
            productType: ProductTypes.CLASS,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 10,
            purchaseId: '',
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3p0dy000ds6c07xpgaxps',
            purchaserId: 'clidgpdf5000fpcnhr8k0mxgj',
            userId: 'clidgpdf5000fpcnhr8k0mxgj', //test199@mailinator.com
            totalCreditsSpent: 10,
            paymentMethod: PaymentMethod.IMMERSIO_CREDIT,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(
            purchaseWithCreditDto
        );
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(false);
            expect(p.creditProcessingMessage).toContain('INSUFFICIENT_CREDIT');
        });
    });
});

/******************* Purchase Subscription *********************/

describe('Credit Management Purchase Subscription', () => {
    let userAccountService: UserAccountService;
    let subscriptionsService: SubscriptionsService;

    beforeEach(async () => {
        const serviceModule: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
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
                UserAccountService,
                RoleManagementService,
                SubdomainSettingsService,
                CoursesService,
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
                CourseStudentService,
            ],
        }).compile();

        userAccountService = serviceModule.get<UserAccountService>(UserAccountService);
        subscriptionsService = serviceModule.get<SubscriptionsService>(SubscriptionsService);
    });

    it('should be defined', () => {
        expect(userAccountService).toBeDefined();
    });

    it('can purchase subscription with credit', async () => {
        const productPurchaseDto = {
            productId: 'clr4ar1650003sa0jkyxlr3ym',
            unitCount: 1,
            productType: ProductTypes.SUBSCRIPTION,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 45,
            purchaseId: '',
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3',
            purchaserId: 'cles4v5jr000nmc0t47mb5o49',
            userId: 'cles4v5jr000nmc0t47mb5o49',
            totalCreditsSpent: 45,
            paymentMethod: PaymentMethod.IMMERSIO_CREDIT,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(purchaseWithCreditDto );
        
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(true);
            expect(p.creditProcessingMessage).toEqual('SUCCESS');
            subscriptionsService._deleteSubscription(p.purchaseId);
        });
        
        

    });

    it('cannot purchase subscription with wrong product id', async () => {
        const productPurchaseDto = {
            productId: 'clr4ar1650003sa0jkyxlr',
            unitCount: 1,
            productType: ProductTypes.SUBSCRIPTION,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 45,
            purchaseId: '',
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3',
            purchaserId: 'cles4v5jr000nmc0t47mb5o49',
            userId: 'cles4v5jr000nmc0t47mb5o49',
            totalCreditsSpent: 45,
            paymentMethod: PaymentMethod.IMMERSIO_CREDIT,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(purchaseWithCreditDto );
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(false);
            expect(p.creditProcessingMessage).toContain('500_UNEXPECTED');
        });
    });

    it('cannot purchase subscription with credit if credit insufficient', async () => {
        const productPurchaseDto = {
            productId: 'clr4ar1650003sa0jkyxlr3ym',
            unitCount: 1,
            productType: ProductTypes.SUBSCRIPTION,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 45,
            purchaseId:''
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3',
            purchaserId: 'clidgpdf5000fpcnhr8k0mxgj',
            userId: 'clidgpdf5000fpcnhr8k0mxgj',
            totalCreditsSpent: 45,
            paymentMethod: PaymentMethod.IMMERSIO_CREDIT,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(purchaseWithCreditDto );
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(false);
            expect(p.creditProcessingMessage).toContain('INSUFFICIENT_CREDIT');
        });
    });
    it('can purchase subscription after direct payment', async () => {
        const productPurchaseDto = {
            productId: 'clr4ar1650003sa0jkyxlr3ym',
            unitCount: 1,
            productType: ProductTypes.SUBSCRIPTION,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 45,
            purchaseId: '',
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3',
            purchaserId: 'cles4v5jr000nmc0t47mb5o49',
            userId: 'cles4v5jr000nmc0t47mb5o49',
            totalCreditsSpent: 45,
            paymentMethod: PaymentMethod.STRIPE,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(purchaseWithCreditDto );
        
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(true);
            expect(p.creditProcessingMessage).toEqual('SUCCESS');
            subscriptionsService._deleteSubscription(p.purchaseId);
        });
    });

    it('can purchase credits after direct payment', async () => {
        const productPurchaseDto = {
            productId: 'clr4ar1650003sa0jkyxlr3ym',
            unitCount: 1,
            productType: ProductTypes.CREDIT,
            creditProcessingComplete: false,
            creditProcessingMessage: '',
            creditsSpent: 45,
            purchaseId: '',
        };

        const purchaseWithCreditDto = {
            subdomainId: 'cldw3pj2w000fs6c0y24w1ey3',
            purchaserId: 'cles4v5jr000nmc0t47mb5o49',
            userId: 'cles4v5jr000nmc0t47mb5o49',
            totalCreditsSpent: 45,
            paymentMethod: PaymentMethod.STRIPE,
            products: [productPurchaseDto],
        };
        const results = await userAccountService.purchaseWithCredit(purchaseWithCreditDto );
        
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        results.forEach((p) => {
            expect(p.creditProcessingComplete).toEqual(true);
            expect(p.creditProcessingMessage).toEqual('SUCCESS');
        });
    });

    


});
