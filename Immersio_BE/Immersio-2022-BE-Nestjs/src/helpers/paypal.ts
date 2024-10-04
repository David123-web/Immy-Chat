import * as paypal from 'paypal-rest-sdk';
import axios from 'axios';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaypalHelper {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) { }

    async _createInstance(subdomainId: string) {
        const _instance = await this.prisma.onlinePaymentGateWay.findFirst({
            where: {
                AND: {
                    subdomainId,
                    type: 'PAYPAL',
                },
            },
        });

        console.log(_instance);

        if (!_instance) throw new InternalServerErrorException();
        return paypal.configure({
            mode: 'sandbox',
            client_id: _instance.clientId,
            client_secret: _instance.secretKey,
        });
    }

    async _createRootInstance() {
        paypal.configure({
            mode: 'sandbox',
            client_id: this.configService.get('PAYPAL_CLIENT_ID'),
            client_secret: this.configService.get('PAYPAL_CLIENT_SECRET'),
        });

        return paypal;
    }

    async _getCredentials(subdomainId: string) {
        const found = await this.prisma.onlinePaymentGateWay.findFirst({
            where: {
                AND: {
                    subdomainId,
                    type: 'PAYPAL',
                },
            },
        });
        return found;
    }

    async authorization(subdomainId: string) {
        const _credentials = await this._getCredentials(subdomainId);
        const response = await axios.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }),
            {
                auth: {
                    username: _credentials.clientId,
                    password: _credentials.secretKey,
                },
            }
        );

        return response.data.access_token;
    }

    async subscribe(subdomainId: string, planId: string, customId: string) {
        const _credentials = await this._getCredentials(subdomainId);

        const result = await axios.post(
            'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
            {
                plan_id: planId,
                custom_id: customId,
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'SUBSCRIBE_NOW',
                },
            },
            {
                auth: {
                    username: _credentials.clientId,
                    password: _credentials.secretKey,
                },
            }
        );
        return result.data;
    }

    async subscriptionDetail(subdomainId: string, billingAgreementId: any) {
        const _credentials = await this._getCredentials(subdomainId);
        const result = await axios.get(
            `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${billingAgreementId}`,
            {
                auth: {
                    username: _credentials.clientId,
                    password: _credentials.secretKey,
                },
            }
        );

        return result.data;
    }

    async cancelSubscription(subdomainId: string, id: string) {
        const _credentials = await this._getCredentials(subdomainId);
        await axios.post(
            `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${id}/cancel`,
            {
                reason: 'Product obsoleted'
            },
            {
                auth: {
                    username: _credentials.clientId,
                    password: _credentials.secretKey,
                },
            }
        );

        return true;
    }

    async getPlan() {
        const list_billing_plan = {
            status: 'ACTIVE',
            page_size: 5,
            page: 1,
            total_required: 'yes',
        };

        paypal.billingPlan.list(list_billing_plan, function (error, billingPlan) {
            if (error) {
                throw error;
            } else {
                console.log('List Billing Plans Response');
                console.log(JSON.stringify(billingPlan));
            }
        });
    }

    async createPlan(name: string, description: string, feeValue: string, successUrl: string, cancelUrl: string) {
        const billingPlanAttributes = {
            description,
            merchant_preferences: {
                auto_bill_amount: 'yes',
                cancel_url: cancelUrl,
                initial_fail_amount_action: 'continue',
                max_fail_attempts: '1',
                return_url: successUrl,
                setup_fee: {
                    currency: 'USD',
                    value: feeValue,
                },
            },
            name,
            payment_definitions: [
                {
                    amount: {
                        currency: 'USD',
                        value: feeValue,
                    },
                    cycles: '0',
                    frequency: 'MONTH',
                    frequency_interval: '1',
                    name: 'Regular 1',
                    type: 'REGULAR',
                },
            ],
            type: 'INFINITE',
        };

        paypal.billingPlan.create(
            billingPlanAttributes,
            function (error, billingPlan) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log('Create Billing Plan Response');
                    console.log(billingPlan);
                }
            }
        );
    }

    async pay(
        subdomainId: string,
        callback: Function,
        transactions: IPaypalTransaction[]
    ) {
        await this._createInstance(subdomainId);
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/payment/paypal/success',
                cancel_url: 'http://localhost:3000/cancel',
            },
            transactions,
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log(payment);
                for (let i = 0; i < payment.links.length; i++) {
                    console.log(payment);
                    if (payment.links[i].rel === 'approval_url') {
                        console.log(payment.links[i].href);
                        callback(payment.links[i].href);
                    }
                }
            }
        });
    }

    async subdomainPay(
        transactions: IPaypalTransaction[],
        callback: (payment: paypal.Payment) => void
    ) {
        await this._createRootInstance();
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/payment/paypal/success',
                cancel_url: 'http://localhost:3000/cancel',
            },
            transactions,
        };

        paypal.payment.create(create_payment_json, async (error, payment) => {
            if (error) {
                throw error;
            } else {
                callback(payment);
            }
        });
    }

    async execute(paymentId: string, config: any) {
        paypal.payment.execute(paymentId, config, (err, payment) => {
            console.log(payment);
        });
    }
}

interface IPaypalTransaction {
    item_list: {
        items: IPaypalItem[];
    };
    amount: {
        currency: string;
        total: string;
    };
    description: string;
}

interface IPaypalItem {
    name: string;
    sku: string;
    price: string;
    currency: string;
    quantity: number;
}
