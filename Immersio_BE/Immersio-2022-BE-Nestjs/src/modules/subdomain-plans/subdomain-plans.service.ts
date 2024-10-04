import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';
import { CreateSubdomainPlanDto } from './dto/create-subdomain-plan.dto';
import { UpdateSubdomainPlanDto } from './dto/update-subdomain-plan.dto';
import { PaypalHelper } from 'src/helpers/paypal';
import { StripeHelper } from 'src/helpers/stripe';
import { PaymentMethod, Role, RootSettingKey, SubdomainPlan } from '@prisma/client';
import * as paypal from 'paypal-rest-sdk';
import * as moment from 'moment';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

@Injectable()
export class SubdomainPlansService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService,
        private readonly stripeHelper: StripeHelper,
        @InjectKysely() private db: Kysely<DB>
    ) { }
    onModuleInit() {
        this.init();
    }

    async init() {
        const subdomainPlan = await this.db
            .selectFrom('SubdomainPlan')
            .select(eb => [
                jsonObjectFrom(eb.fn.count('id').distinct()).as('total')
            ])
            .executeTakeFirst();
        const total = typeof subdomainPlan.total == 'number' ? subdomainPlan.total : 0;
        if (total > 0) return;

        const studentPrices = [
            {
                price: 5,
                studentMinimum: 0,

            }, {
                price: 4,
                studentMinimum: 31,

            }, {
                price: 3.2,
                studentMinimum: 101,
            }
        ];

        const storagePrices = [
            {
                price: 0,
                storageMinimum: 0,
            }, {
                price: 0.025,
                storageMinimum: 5,
            }, {
                price: 0.024,
                storageMinimum: 50,
            }
        ];

        const stripeProduct = await this.stripeHelper.createRootProduct('Pay As You Go');
        const [stripeStudentPrice, stripeStoragePrice] = await Promise.all([
            this.stripeHelper.createRootPriceWithTiers(
                stripeProduct.id,
                'Pay As You Go - Price/Student',
                studentPrices.map((p: { price: number; studentMinimum: number }, i: number) => ({
                    unit_amount: p.price * 100,
                    up_to: i < studentPrices.length - 1 ? studentPrices[i + 1].studentMinimum - 1 : 'inf',
                })),
                'usd'
            ),
            this.stripeHelper.createRootPriceWithTiers(
                stripeProduct.id,
                'Pay As You Go - Price/GB',
                storagePrices.map((p: { price: number; storageMinimum: number }, i: number) => ({
                    unit_amount_decimal: (p.price * 100).toString(),
                    up_to: i < storagePrices.length - 1 ? storagePrices[i + 1].storageMinimum : 'inf',
                })),
                'usd'
            )
        ]);


        await this.prisma.subdomainPlan.create({
            data: {
                key: 'payg',
                description: 'Pay As You Go',
                stripeProductId: stripeProduct.id,
                stripeStudentPriceId: stripeStudentPrice.id,
                stripeStoragePriceId: stripeStoragePrice.id,
                type: 'PAY_AS_YOU_GO',
                sampleLessons: 100,
                features: [
                    'AI_LIBRARY',
                    'CUSTOM_DOMAIN',
                    'EMAIL_SUPPORT',
                    'IMMY_CHAT_BOT',
                    'MY_RECORDINGS',
                    'PRIORITY_SUPPORT',
                    'SAMPLE_LESSON',
                    'STORAGE_LIMIT',
                    'SUBDOMAIN',
                    'TUTOR_MATCH'
                ],
                studentProratedPrices: {
                    createMany: {
                        data: studentPrices
                    }
                },
                storageProratedPrices: {
                    createMany: {
                        data: storagePrices
                    }
                }
            }
        });
    }

    async findAll({ skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto) {
        const [result, total] = await Promise.all([
            this.prisma.subdomainPlan.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId
                }, include: {
                    storageProratedPrices: true,
                    studentProratedPrices: true,
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc ? 'desc' : 'asc'
                }
            }),
            this.prisma.subdomainPlan.count()
        ]);
        return {
            total, result 
        };
    }

    async findDefault() {
        return this.prisma.subdomainPlan.findFirst({
            where: {
                key: 'payg'
            }, include: {
                storageProratedPrices: true,
                studentProratedPrices: true,
            }
        });
    }

    async create({ studentProratedPrices, storageProratedPrices, ...data }: CreateSubdomainPlanDto) {
        return this.prisma.subdomainPlan.create({
            data: {
                ...data,
                studentProratedPrices: {
                    createMany: {
                        data: studentProratedPrices
                    }
                },
                storageProratedPrices: {
                    createMany: {
                        data: storageProratedPrices
                    }
                },
                type: 'FLAT_RATE'
            }
        });
    }

    async update(
        id: string,
        { studentProratedPrices, storageProratedPrices, ...data }: UpdateSubdomainPlanDto
    ) {
        await this.prisma.$transaction([
            this.prisma.subdomainPlan.update({
                where: {
                    id,
                },
                data
            }),
            studentProratedPrices ? this.prisma.studentProratedPrice.deleteMany({
                where: {
                    subdomainPlanId: id
                }
            }) : null,
            studentProratedPrices ? this.prisma.studentProratedPrice.createMany({
                data: studentProratedPrices.map(pp => ({
                    ...pp, subdomainPlanId: id
                }))
            }) : null,
            storageProratedPrices ? this.prisma.storageProratedPrice.deleteMany({
                where: {
                    subdomainPlanId: id
                }
            }) : null,
            storageProratedPrices ? this.prisma.storageProratedPrice.createMany({
                data: storageProratedPrices.map(pp => ({
                    ...pp, subdomainPlanId: id
                }))
            }) : null
        ]);
        return true;
    }

    async test() {
        return null;
    }

    async remove(id: string) {
        const plan = await this.prisma.subdomainPlan.findUnique({
            where: {
                id 
            } 
        });
        if (plan.type === 'PAY_AS_YOU_GO') throw new BadRequestException('Cannot delete this default plan!');
        return this.prisma.subdomainPlan.delete({
            where: {
                id,
            },
        });
    }

    // async subscribe(subdomainId: string) {
    //     //Get subdomain info and total student
    //     const subdomain = await this.prisma.subdomain.findUnique({
    //         where: {
    //             id: subdomainId
    //         },
    //         include: {
    //             subdomainBilling: true,
    //             subdomainPlan: true,
    //             _count: {
    //                 select: {
    //                     users: {
    //                         where: {
    //                             role: Role.STUDENT
    //                         }
    //                     },
    //                 }
    //             }
    //         }
    //     });

    //     let subdomainPlan: SubdomainPlan = subdomain.subdomainPlan;

    //     if (!subdomain.subdomainBilling) throw new NotFoundException('Subdomain billing not found!')
    //     if (!subdomain.subdomainBilling.paymentMethod) throw new NotFoundException('Payment method not found!')
    //     if (!subdomainPlan) {
    //         const plan = await this.prisma.subdomainPlan.findUnique({ where: { key: 'payg', type: 'PAY_AS_YOU_GO' } })
    //         const updatedSubdomain = await this.prisma.subdomain.update({ where: { id: subdomainId }, data: { subdomainPlanId: plan.id }, include: { subdomainPlan: true } })
    //         subdomainPlan = updatedSubdomain.subdomainPlan
    //     }

    //     if (subdomain.subdomainBilling.paymentMethod === 'STRIPE') {
    //         const subscription = await this.stripeHelper.subscribeRootPlan(subdomain.stripeAccountId, 50, 'usd', subdomainPlan.stripeProductId, subdomainPlan.trial ? moment().add(subdomainPlan.daysTrial, 'days').unix() : undefined)
    //         await this.prisma.subscription.create({
    //             data: {
    //                 subdomain: { connect: { id: subdomainId } },
    //                 referenceId: subscription.id,
    //                 endAt: moment(subscription.current_period_end).toISOString(),
    //                 status: 'CREATED',
    //                 method: 'STRIPE',
    //                 trialEndAt: subdomainPlan.trial ? moment().add(subdomainPlan.daysTrial, 'days').toISOString() : moment().toISOString()
    //             }
    //         })
    //         return;
    //     } else {
    //         throw new BadRequestException('Immersio does not support this payment method yet!')
    //     }
    // }

    async checkout(subdomainId: string, userId: string) {
        //Check exist and get subdomain, plan and user
        const plan = await this.findDefault();
        if (!plan) throw new InternalServerErrorException('Default plan not found!');
        const user = await this.prisma.user.findUnique({
            include: {
                subdomain: {
                    include: {
                        subdomainBilling: true 
                    } 
                } 
            },
            where: {
                subdomainId, id: userId
            }
        });
        const subdomain = user.subdomain;
        if (!user) throw new NotFoundException('User not found!');
        if (!subdomain) throw new NotFoundException('Subdomain not found!');
        if (!subdomain.subdomainBilling) throw new NotFoundException('Subdomain billing info not found!');
        switch (subdomain.subdomainBilling.paymentMethod) {
        case PaymentMethod.STRIPE: {
            const stripe = await this.stripeHelper._createRootInstance();
            const checkout = await stripe.checkout.sessions.create({
                customer: subdomain.subdomainBilling.stripeId,
                mode: 'setup',
                payment_method_types: ['card'],
                success_url: 'https://immersio.io', //SHOULD BE api.immersio.io
                cancel_url: 'https://immersio.io'
            });
            return {
                url: checkout.url 
            };
        }

        //TODO: Need to work with paypal later  
        case PaymentMethod.PAYPAL:
            break;
        default:
            throw new BadRequestException('Please choose between Paypal and Stripe');
        }
        return true;
    }

    async successCheckout(data: any) {
        console.log(data);
    }
}
