import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { StripeHelper } from 'src/helpers/stripe';
import { ConfigService } from '@nestjs/config';
import { RoleManagementService } from '../role-management/role-management.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';

describe('AuthController', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const authModule: TestingModule = await Test.createTestingModule({
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
                RoleManagementService,
                NotificationsService,
                TimeZoneService,
                SubdomainSettingsService
            ],
        }).compile();

        authService = authModule.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should validate user', async () => {
        const user = await authService.validateUser(
            'cldw3pj2w000fs6c0y24w1ey3', // dev subdomain
            'embassy.subdomain@mailinator.com',
            'immersio@123'
        );
        expect(user).toBeDefined();
        expect(user.email).toEqual('embassy.subdomain@mailinator.com');
        expect(user.role).toEqual('SUBDOMAIN_ADMIN');
    });
});
