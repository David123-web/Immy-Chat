import { Module } from '@nestjs/common';
import { SubdomainService } from './subdomain.service';
import { SubdomainController } from './subdomain.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { UsersModule } from '../users/users.module';
import { StripeHelper } from 'src/helpers/stripe';
import { SubdomainPlansService } from '../subdomain-plans/subdomain-plans.service';
import { PaypalHelper } from 'src/helpers/paypal';

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
    controllers: [SubdomainController],
    providers: [SubdomainService, StripeHelper, SubdomainPlansService, PaypalHelper],
})
export class SubdomainModule { }
