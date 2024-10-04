import { Module } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagementController } from './role-management.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { TimeZoneModule } from '../time-zones/time-zone.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '2 days',
            },
        }),
    ],
    controllers: [RoleManagementController],
    providers: [RoleManagementService, NotificationsService, TimeZoneService],
})
export class RoleManagementModule {}
