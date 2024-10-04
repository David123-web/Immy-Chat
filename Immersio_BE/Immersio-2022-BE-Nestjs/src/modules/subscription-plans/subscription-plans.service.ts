import { Injectable, OnModuleInit } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { StripeHelper } from 'src/helpers/stripe';
import { PaypalHelper } from 'src/helpers/paypal';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { InjectKysely } from 'nestjs-kysely';
import { SearchParamsDto } from 'src/common/dto';

@Injectable()
export class SubscriptionPlansService {
    constructor(
    @InjectKysely() private db: Kysely<DB>,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly stripeHelper: StripeHelper,
    private readonly paypalHelper: PaypalHelper
    ) {}

    async create(subdomainId: string, data: CreateSubscriptionPlanDto) {
        console.log(`service create ${JSON.stringify(data, null, 2)}`);

        return this.prisma.subscriptionPlan.create({
            data: {
                ...data,
                subdomainId,
            },
        });
    }

    private async _createStripe(
        subdomainId: string,
        name: string,
        amount: number
    ) {
        this.stripeHelper.createPlan(subdomainId, {
            amount,
            currency: 'usd',
            interval: 'month',
            nickname: name,
        });
    }

    private async _createPaypal(
        subdomainId: string,
        name: string,
        description: string,
        amount: number,
        successUrl: string,
        cancelUrl: string
    ) {
        this.paypalHelper.createPlan(
            name,
            description,
            amount.toString(),
            successUrl,
            cancelUrl
        );
    }

    async findMany(subdomainId: string, filter:SearchParamsDto ) {
        const searchObject = {
            subdomainId: subdomainId, 
        };

        console.log(`${JSON.stringify(filter)}`);
    
        if (filter.searchBy && filter.searchKey) {
            if (filter.searchBy === 'title') {
                searchObject[filter.searchBy] = {
                    contains:filter.searchKey,
                };
            } else if (filter.searchBy === 'term') {
                searchObject[filter.searchBy] = {
                    equals: parseInt(filter.searchKey),
                };
            }else if (filter.searchBy === 'status') {
                searchObject[filter.searchBy] =
                     filter.searchKey === 'true'
                         ? true
                         : false;
            } else {
                throw new BadRequestException(
                    'searchBy must be term, title,  or status'
                );
            } 
        }

        const results = await this.prisma.subscriptionPlan.findMany({
            where: searchObject,
        });
    
        return {
            data: results,
            total: results.length
        };
    }
    
    async findOne(id: string) {
        const sp = await this.prisma.subscriptionPlan.findUnique({
            where: {
                id,
            },
        });
        if (!sp) throw new NotFoundException();
        return sp;
    }

    async update(id: string, data: UpdateSubscriptionPlanDto ) {
        const plan = await this.db
            .selectFrom('SubscriptionPlan')
            .where('id', '=', id)
            .executeTakeFirst();
        if (!plan) throw new NotFoundException();

        
        const updateData = {
            ...data 
        }; 
        return this.prisma.subscriptionPlan.update({
            where: {
                id,
            },
            data: updateData,
        });
    }

    async remove(id: string) {
        return this.prisma.subscriptionPlan.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            },
        });
    }
}
