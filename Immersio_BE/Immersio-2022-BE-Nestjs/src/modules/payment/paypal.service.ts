import { Injectable } from '@nestjs/common';
import {ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,} from '@nestjs/common/exceptions';
import * as moment from 'moment';
import { PaypalHelper } from 'src/helpers/paypal';
import { PrismaService } from '../prisma/prisma.service';
import PaypalSubscribeDto from './dto/paypal-subscribe.dto';

@Injectable()
export class PaypalPaymentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paypalHelper: PaypalHelper
    ) { }

    async findAll(userId: string) {
        return await this.prisma.subscription.findMany({
            where: {
                userId,
            },
            include: {
                plan: true,
            },
        });
    }

    async subscribe(
        subdomainId: string,
        userId: string,
        { planId }: PaypalSubscribeDto
    ) {
        const existedSubscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
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
        const subscription = await this.prisma.subscription.create({
            data: {
                subdomainId,
                planId,
                userId,
                status: 'PENDING',
                method: 'PAYPAL',
                endAt: moment().add(30, 'days').toISOString(),
            },
        });

        const paypalSubscription: any = await this.paypalHelper.subscribe(
            subdomainId,
            plan.paypalId,
            subscription.id
        );

        const approveLink = paypalSubscription.links.find(
            (x) => x.rel === 'approve'
        );

        return approveLink;
    }

    // async pay(subdomainId: string, res: any, data: PaypalOneTimePaymentDto) {
    //     const _foundCreditPackage = await this.prisma.creditPackage.findUnique({
    //         where: {
    //             id: data.packageId,
    //         },
    //     });
    //     if (!_foundCreditPackage)
    //         throw new NotFoundException('Can not found your credit package');

    //     this.paypalHelper.pay(subdomainId, (url: string) => res.redirect(url), [
    //         {
    //             item_list: {
    //                 items: [],
    //             },
    //             amount: {
    //                 currency: 'USD',
    //                 total: _foundCreditPackage.price.toString(),
    //             },
    //             description: _foundCreditPackage.description,
    //         },
    //     ]);
    // }

    async success({ PayerID, paymentId }: any) {
        this.paypalHelper.execute(paymentId, {
            'payer_id': PayerID,
        });
    }

    async cancel(
        subdomainId: string,
        userId: string,
        id: string
    ): Promise<boolean> {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                id,
            },
        });

        if (!subscription) {
            throw new NotFoundException();
        }

        if (subscription.userId !== userId) throw new ForbiddenException();

        const success = await this.paypalHelper.cancelSubscription(
            subdomainId,
            subscription.referenceId
        );

        if (!success) throw new InternalServerErrorException();

        return true;
    }

    async webhook(data: any) {
        console.log(data);
        switch (data.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
            this._handlePaymentCaptureCompleted(data);
            break;

        case 'PAYMENT.CAPTURE.REFUNDED':
            // this._handlePaymentCaptureRefunded(data);
            break;

        case 'PAYMENT.SALE.COMPLETED': // payment for recurring
            this._handleRecurringPaymentCompleted(data);
            break;

        case 'PAYMENT.SALE.REFUNDED':
            this._handlePaymentSaleRefunded(data);
            break;

        case 'BILLING.SUBSCRIPTION.CREATED':
            this._handleSubscriptionCreated(data);
            break;

        case 'BILLING.SUBSCRIPTION.ACTIVATED':
            this._handleSubscriptionActivated(data);
            break;

        case 'CHECKOUT.ORDER.APPROVED':
            // this._handleOrderAuthorized(data);
            break;

        case 'BILLING.SUBSCRIPTION.CANCELLED':
            this._handleSubscriptionCancelled(data);
        }
    }

    private async _handleSubscriptionCreated(data: any): Promise<void> {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                id: data.resource.custom_id,
            },
        });

        if (!subscription || subscription.status !== 'PENDING') return;
        await this.prisma.subscription.update({
            where: {
                id: data.resource.custom_id,
            },
            data: {
                referenceId: data.resource.id,
                status: 'CREATED',
            },
        });
    }

    private async _handleSubscriptionCancelled(data: any) {
        await this.prisma.subscription.update({
            where: {
                referenceId: data.resource.id,
            },
            data: {
                status: 'CANCELLED',
            },
        });
    }

    private async _handleSubscriptionActivated(data: any) {
        await this.prisma.subscription.update({
            where: {
                referenceId: data.resource.id,
            },
            data: {
                status: 'ACTIVATED',
                nextBillingTime: data.billing_info?.next_billing_time,
                referenceId: data.resource.id,
            },
        });
    }

    private async _handlePaymentSaleRefunded(data: any) { }

    private async _handleRecurringPaymentCompleted(data: any): Promise<void> {
        const _found = await this.prisma.subscription.findUnique({
            where: {
                id: data.resource.custom_id,
            },
        });

        const detail = await this.paypalHelper.subscriptionDetail(
            _found.subdomainId,
            data.resource.billing_agreement_id
        );

        await this.prisma.subscription.update({
            where: {
                id: data.resource.custom_id,
            },
            data: {
                referenceId: data.resource.billing_agreement_id,
                status: 'ACTIVATED',
                nextBillingTime: detail.billing_info?.next_billing_time,
            },
        });
    }

    private async _handlePaymentCaptureCompleted(data): Promise<void> {
        await this.prisma.classBooking.update({
            where: {
                referenceId: data.resource.custom_id,
            },
            data: {
                status: 'PAID',
            },
        });
    }
}
