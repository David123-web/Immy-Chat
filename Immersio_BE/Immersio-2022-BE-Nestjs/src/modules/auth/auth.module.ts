import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { StripeHelper } from '../../helpers/stripe';
import { FilesService } from '../files/files.service';
// import MailHelper from 'src/helpers/mail';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RoleManagementService } from '../role-management/role-management.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { FbStrategy } from './fb.strategy';
import { GgStrategy } from './gg.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '2 days',
            },
        }),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        PrismaModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UsersService,
        // MailHelper,
        LocalStrategy,
        JwtStrategy,
        FbStrategy,
        GgStrategy,
        NotificationsService,
        FilesService,
        StripeHelper,
        RoleManagementService,
        TimeZoneService,
        SubdomainSettingsService
    ],
})
export class AuthModule {}
