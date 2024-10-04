import {ConflictException,
    ForbiddenException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,} from '@nestjs/common';
import {InvoiceStatus,
    PaymentMethod,
    Subscription,
    SubscriptionStatus,} from '@prisma/client';
import * as moment from 'moment';
import { StripeHelper } from 'src/helpers/stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripePaymentService {
    constructor(
        private readonly stripe: StripeHelper,
        private readonly prisma: PrismaService
    ) {}

    async subscribe(subdomainId: string, userId: string, planId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) throw new InternalServerErrorException();

        const { stripeAccountId } = user;

        const existedSubscription = await this.prisma.subscription.findFirst({
            where: {
                userId: userId,
                subdomainId,
                planId,
                status: {
                    in: ['CREATED', 'ACTIVATED'],
                },
            },
        });

        if (existedSubscription)
            throw new ConflictException('You\'re already subscribed!');

        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: {
                id: planId,
            },
        });

        if (!plan || !plan.stripeProductId)
            throw new InternalServerErrorException();

        const session = await this.stripe.createCheckoutSession(
            subdomainId,
            stripeAccountId,
            plan.stripeProductId
        );
        if (!session) throw new InternalServerErrorException();

        await this.prisma.subscription.create({
            data: {
                subdomainId,
                planId,
                userId,
                status: SubscriptionStatus.PENDING,
                method: PaymentMethod.STRIPE,
                endAt: moment().add(30, 'days').toISOString(),
            },
        });

        return session;
    }

    // async pay(userId: string, productId: string) {
    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             id: userId,
    //         },
    //     });
    //     if (!user) throw new InternalServerErrorException();

    //     const product = await this.prisma.creditPackage.findUnique({
    //         where: {
    //             id: productId,
    //         },
    //     });

    //     if (product.gateway !== PaymentGatewayType.STRIPE)
    //         throw new NotAcceptableException();

    //     const { stripeAccountId } = user;
    //     const session = await this.stripe.createCheckoutSession(
    //         user.subdomainId,
    //         stripeAccountId,
    //         product.productId,
    //         'payment',
    //         product
    //     );
    //     //TODO: save transaction in log
    //     return session;
    // }

    async webhook(body: any) {
        const { type, data } = body;
        console.log(type, data);
        switch (type) {
        // case 'invoice.created':
        // case 'invoice.updated':
        case 'invoice.payment_succeeded':
            this._handleInvoice(data);
            break;
            // case 'payment_intent.succeeded':
            //     this._handlePaymentIntent(data);
            //     break;
        case 'checkout.session.completed':
        }
        return body;
    }

    private async _findSubscription(
        stripeAccountId,
        stripeProductId
    ): Promise<Subscription> {
        const found = await this.prisma.subscription.findFirst({
            where: {
                AND: {
                    user: {
                        stripeAccountId,
                    },
                    plan: {
                        stripeProductId,
                    },
                },
            },
        });
        return found;
    }

    private async _handleInvoice(data: any): Promise<void> {
        const { object: subData } = data;
        const {
            id: refId,
            metadata,
            amount_due,
            currency,
            customer,
            current_period_end,
            invoice_pdf,
        } = subData;
        const { customer: customerMetadata, type, userId } = metadata;
        const latestInvoice = await this.prisma.invoice.findFirst({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: moment().toDate(),
                        },
                    },
                    {
                        createdAt: {
                            lt: moment().add(1, 'month').toDate(),
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const invoice = await this.prisma.invoice.upsert({
            include: {
                subdomainPlan: true,
                subdomain: true,
            },
            where: {
                refId,
            },
            create: {
                refId,
                amount: amount_due / 100,
                currency: currency.toUpperCase(),
                downloadUrl: invoice_pdf,
                status: 'succeeded'
                    ? InvoiceStatus.PAID
                    : InvoiceStatus.PENDING,
                method: 'STRIPE',
                numberInMonth: latestInvoice
                    ? latestInvoice.numberInMonth + 1
                    : 1,
            },
            update: {
                amount: amount_due / 100,
                status: 'succeeded'
                    ? InvoiceStatus.PAID
                    : InvoiceStatus.PENDING,
                downloadUrl: invoice_pdf,
                currency: currency.toUpperCase(),
                method: 'STRIPE',
                numberInMonth: latestInvoice
                    ? latestInvoice.numberInMonth + 1
                    : 1,
            },
        });
        if (type === 'subdomain_billing' && invoice.subdomainPlanId) {
            const subdomain = await this.prisma.subdomain.update({
                where: {
                    id: invoice.subdomainId,
                },
                data: {
                    expiredAt: moment(
                        moment(invoice.subdomain.expiredAt).isBefore()
                            ? undefined
                            : invoice.subdomain.expiredAt
                    )
                        .add(30, 'days')
                        .toISOString(),
                    sendInvoiceCount: 0, //reset count when subdomain is paid
                    remindCount: 0,
                },
            });
            await this.prisma.transaction.create({
                data: {
                    amount: amount_due,
                    currency: currency.toUpperCase(),
                    refId,
                    status: 'SUCCESS',
                    paymentType: 'STRIPE',
                    userId: userId,
                    invoice: {
                        connect: {
                            id: invoice.id,
                        },
                    },
                },
            });
            console.log(subdomain);
        }
    }

    private async _handlePaymentIntent(data: any) {
        //DO NOT use this function anymore, because need metadata from invoice
        const { object: subData } = data;
        const {
            id: refId,
            metadata,
            amount,
            currency,
            customer,
            current_period_end,
        } = subData;
        const { customer: customerMetadata } = metadata;
        console.log('customer:', customerMetadata);
        await this.prisma.transaction.create({
            data: {
                amount,
                currency: currency.toUpperCase(),
                refId,
                status: 'SUCCESS',
                paymentType: 'STRIPE',
            },
        });
    }

    private async _handleSubscriptionCreated(data: any): Promise<void> {
        const { object: subData } = data;
        const {
            id: subId,
            plan,
            metadata,
            customer,
            current_period_end,
        } = subData;
        const { customer: customerMetadata } = metadata;

        if (!customer && !customerMetadata) return;

        const subscription = await this._findSubscription(
            customer || customerMetadata,
            plan.id
        );

        if (!subscription || subscription.status !== SubscriptionStatus.PENDING)
            throw new InternalServerErrorException();

        await this.prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                status: SubscriptionStatus.CREATED,
                referenceId: subId,
                endAt: new Date(current_period_end),
            },
        });
    }

    private async _handleSubscriptionCharged(data: any): Promise<void> {
        const { object: subData } = data;
        const { metadata, customer, lines } = subData;
        const { customer: customerMetadata } = metadata;
        const { plan } = lines.data[0];

        if (!customer && !customerMetadata)
            throw new InternalServerErrorException();

        const subscription = await this._findSubscription(
            customer ?? customerMetadata,
            plan.id
        );

        if (!subscription || subscription.status !== SubscriptionStatus.CREATED)
            throw new InternalServerErrorException();

        await this.prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                status: SubscriptionStatus.ACTIVATED,
            },
        });
    }

    async cancelSubscription(subdomainId: string, userId: string, id: any) {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                id,
            },
        });

        if (!subscription) {
            throw new NotFoundException();
        }

        if (subscription.userId && subscription.userId !== userId)
            throw new ForbiddenException();

        const canceled = await this.stripe.cancelSubscription(
            subdomainId,
            subscription.referenceId
        );
        if (!canceled) throw new InternalServerErrorException();

        await this.prisma.subscription.update({
            where: {
                id,
            },
            data: {
                status: SubscriptionStatus.CANCELLED,
            },
        });
        return true;
    }

    // private async _handleCompletedOneTimePayment(data: any) {
    //     const { object: paymentData } = data;
    //     const { mode, customer, metadata } = paymentData;
    //     if (mode !== 'payment') return;

    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             stripeAccountId: customer,
    //         },
    //     });
    //     if (!user) throw new InternalServerErrorException();

    //     const foundCreditPackage = await this.prisma.creditPackage.findUnique({
    //         where: {
    //             id: metadata.productId,
    //         },
    //     });

    //     if (!foundCreditPackage)
    //         throw new NotFoundException('Can not found credit package');

    //     const res = await this.creditsService.add(
    //         user.id,
    //         foundCreditPackage.credit
    //     );

    //     if (res) return HttpStatus.OK;
    //     else throw new InternalServerErrorException();
    // }

    private async _handleSubscriptionDeleted(data: any) {
        const { object: subData } = data;
        const { metadata, customer, lines } = subData;
        const { customer: customerMetadata } = metadata;
        const { plan } = lines.data[0];

        const subscription = await this._findSubscription(
            customer || customerMetadata,
            plan.id
        );

        if (!subscription)
            throw new NotFoundException('Can not find you subscription');

        await this.prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                status: SubscriptionStatus.DELETED,
            },
        });

        return HttpStatus.OK;
    }

    private async _handleRecursivePaymentFailed(data: any) {
        const { object: invoice } = data;
        if (invoice.collection_method !== 'charge_automatically' || !invoice)
            return;

        const { customer, lines } = invoice;
        const plan = lines.data[0];

        const subscription = await this._findSubscription(
            customer,
            plan.price.id
        );

        if (!subscription)
            throw new NotFoundException('Subscription plan not found');

        await this.prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                status: SubscriptionStatus.PAYMENT_FAILED,
            },
        });

        return HttpStatus.OK;
    }
}
