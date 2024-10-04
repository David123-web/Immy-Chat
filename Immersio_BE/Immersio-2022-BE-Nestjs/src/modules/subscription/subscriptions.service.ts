import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { StripeHelper } from 'src/helpers/stripe';
import { PaypalHelper } from 'src/helpers/paypal';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class SubscriptionsService {
    constructor(
    @InjectKysely() private db: Kysely<DB>,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly stripeHelper: StripeHelper,
    private readonly paypalHelper: PaypalHelper
    ) {}

    async create(subdomainId: string, data: CreateSubscriptionDto) {
        console.log(`service create ${JSON.stringify(data, null, 2)}`);

        return this.prisma.subscription.create({
            data: {
                ...data,
                subdomainId,
            },
        });
    }

    async findAll(subdomainId: string) {
        return this.prisma.subscription.findMany({
            where: {
                subdomainId,
            },
        });
    }

    async findOne(id: string) {
        const sp = await this.prisma.subscription.findUnique({
            where: {
                id,
            },
        });
        if (!sp) throw new NotFoundException();
        return sp;
    }

    async findExtantPlanForUser(userId: string, planId: string) {
        const plans = await this.prisma.subscription.findMany({
            where: {
                userId: userId,
                planId: planId
            },
        });
        return plans;
    }

    async findAnyExtantPlanForUser(userId: string) {
        const plans = await this.prisma.subscription.findMany({
            where: {
                userId: userId,
            },
        });
        return plans;
    }

    /***FOR UNIT TESTS ONLY! */
    async _deleteSubscription(id: string) {
        return this.prisma.subscription.delete({
            where: {
                id
            },
        });
    }
    

    


}
