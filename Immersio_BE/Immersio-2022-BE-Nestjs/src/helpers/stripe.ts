import { ConfigService } from '@nestjs/config';
import { AddCardDto } from 'src/modules/payment/dto/add-card.dto';
import Stripe from 'stripe';
import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import {  Subdomain } from '@prisma/client';
import { getSubdomainUrl } from './common';
import { RegisterRootPackageDto } from 'src/modules/root-packages/dto/register-root-package.dto';
import { RegisterSubdomainPlanDto } from 'src/modules/subdomain-plans/dto/register-subdomain-plan.dto';
import moment from 'moment';
import { Cache } from 'cache-manager';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class StripeHelper {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        @InjectKysely() private db: Kysely<DB>
    ) {}

    async _createInstance(subdomainId: string) {
        const _instance = await this.prisma.onlinePaymentGateWay.findFirst({
            where: {
                AND: {
                    subdomainId,
                    type: 'STRIPE',
                },
            },
        });
        if (!_instance) throw new InternalServerErrorException();
        return new Stripe(_instance.secretKey, {
            apiVersion: '2022-11-15',
        });
    }

    async createCustomer(subdomainId: string, email: string, name: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.customers.create({
            email, name 
        });
    }

    async getCustomerByEmail(subdomainId: string, email: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.customers.list({
            email,
        });
    }

    async getCustomerById(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.customers.retrieve(id);
    }

    async addCard(
        subdomainId: string,
        customerId: string,
        { name, cvc, exp_month, exp_year, number }: AddCardDto
    ) {
        try {
            const _stripe = await this._createInstance(subdomainId);
            const token = await _stripe.tokens.create({
                card: {
                    name,
                    exp_month: exp_month.toString(),
                    exp_year: exp_year.toString(),
                    number,
                    cvc,
                },
            });

            const card = await _stripe.customers.createSource(customerId, {
                source: `${token.id}`,
            });
            return card.id;
        } catch (err) {
            throw new Error(err);
        }
    }

    async replaceCard(
        subdomainId: string,
        customerId: string,
        dto: AddCardDto
    ) {
        const _stripe = await this._createInstance(subdomainId);
        const cards = await _stripe.customers.listSources(customerId);
        await Promise.all(
            cards.data.map(async (card) => {
                await _stripe.customers.deleteSource(customerId, card.id);
            })
        );
        return this.addCard(subdomainId, customerId, dto);
    }

    async getCard(subdomainId: string, customerId: string) {
        const _stripe = await this._createInstance(subdomainId);
        const cards = await _stripe.customers.listSources(customerId);
        return cards.data[0];
    }

    async charge(
        subdomainId: string,
        receiptEmail: string,
        amount: number,
        customerId: string
    ) {
        try {
            const _stripe = await this._createInstance(subdomainId);
            return _stripe.charges.create({
                receipt_email: receiptEmail,
                amount: amount * 100,
                currency: 'usd',
                customer: customerId,
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    async createInvoice(
        subdomainId: string,
        customerId: string,
        items: IInvoiceItem[] = []
    ) {
        const _stripe = await this._createInstance(subdomainId);
        const invoice = await _stripe.invoices.create({
            collection_method: 'charge_automatically',
            customer: customerId,
        });
        this.addInvoiceItem(subdomainId, customerId, invoice.id, items);
        return invoice;
    }

    async addInvoiceItem(
        subdomainId: string,
        customerId: string,
        invoiceId: string,
        items: IInvoiceItem[] = []
    ) {
        const _stripe = await this._createInstance(subdomainId);
        Promise.all(
            items.map(async (item) => {
                await _stripe.invoiceItems.create({
                    invoice: invoiceId,
                    customer: customerId,
                    quantity: item.quantity,
                    unit_amount: item.unit_amount,
                    description: item.description,
                });
            })
        );
        return;
    }

    async payInvoice(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.invoices.pay(id);
    }

    async getCharge(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.charges.retrieve(id);
    }

    async createCheckoutSession(
        subdomainId: string,
        customer: string,
        price: string,
        type?: Stripe.Checkout.SessionCreateParams.Mode,
        // creditPackage?: CreditPackage,
    ) {
        const subdomainUrl = await getSubdomainUrl(this.db, subdomainId);

        const _stripe = await this._createInstance(subdomainId);
        const session = await _stripe.checkout.sessions.create({
            mode: type ?? 'subscription',
            payment_method_types: ['card'],
            customer,
            line_items: [
                {
                    price,
                    quantity: 1,
                },
            ],
            success_url: `${subdomainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${subdomainUrl}/failed`,
            metadata: {
                // productId: creditPackage.id,
            },
            subscription_data:
                type === 'subscription'
                    ? {
                        metadata: {
                            customer,
                        },
                    }
                    : {
                    },
        });
        return session;
    }

    async cancelSubscription(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        const deleted = await _stripe.subscriptions.del(id);
        return deleted;
    }

    async createProduct(subdomainId: string, data: any) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.products.create(data);
    }

    async updateProduct(subdomainId: string, id: string, data: any) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.products.update(id, data);
    }

    async retrieveProduct(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.products.retrieve(id);
    }

    async listProducts(subdomainId: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.products.list();
    }

    async deleteProduct(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.products.del(id);
    }

    async createPlan(subdomainId: string, data: Stripe.PlanCreateParams) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.plans.create(data);
    }

    async updatePlan(subdomainId: string, id: string, data: any) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.plans.update(id, data);
    }

    async retrievePlan(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.plans.retrieve(id);
    }

    async listPlans(subdomainId: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.plans.list();
    }

    async deletePlan(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.plans.del(id);
    }

    async createCoupon(subdomainId: string, data: any) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.coupons.create(data);
    }

    async updateCoupon(subdomainId: string, id: string, data: any) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.coupons.update(id, data);
    }

    async retrieveCoupon(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.coupons.retrieve(id);
    }

    async listCoupons(subdomainId: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.coupons.list();
    }

    async deleteCoupon(subdomainId: string, id: string) {
        const _stripe = await this._createInstance(subdomainId);
        return _stripe.coupons.del(id);
    }

    //--------------------ROOTDOMAIN PAYMENT--------------------//
    async _createRootInstance() {
        return new Stripe(this.configService.get('STRIPE_KEY'), {
            apiVersion: '2022-11-15',
        });
    }

    async createRootProduct(name: 'Pay As You Go' | 'Flat Rate', id?: string) {
        const _stripe = await this._createRootInstance();
        const product = await _stripe.products.create({
            name: name === 'Pay As You Go' ? name : `${name} - ${id}`,
        });  
        return product;
    }

    async createRootPrice(productId: string, nickname: string, unitAmount: number, currency: string) {
        const _stripe = await this._createRootInstance();
        const price = await _stripe.prices.create({
            nickname,
            product: productId,
            unit_amount: unitAmount,
            currency,
            recurring: {
                interval: 'month',
            },
        });

        return price;
    }

    async createRootPriceWithTiers(productId: string, nickname: string, tiers: Stripe.PriceCreateParams.Tier[], currency: string) {
        const _stripe = await this._createRootInstance();
        const price = await _stripe.prices.create({
            nickname,
            product: productId,
            currency,
            tiers,
            recurring: {
                interval: 'month',
                usage_type: 'metered'
            },
            tiers_mode: 'graduated',
            billing_scheme: 'tiered',
            expand: ['tiers'],
        });

        return price;
    }


    //Update total number of users to stripe
    async updateRootUsageRecord(subscriptionItemId: string, quantity: number) {
        const _stripe = await this._createRootInstance();
        _stripe.subscriptionItems.createUsageRecord(
            subscriptionItemId,
            {
                quantity,
                timestamp: moment().unix(),
                action: 'set',
            }
        );
    }

    async createRootCustomer(subdomain: Subdomain, {name, email, phone, address}: RegisterSubdomainPlanDto) {
        const _stripe = await this._createRootInstance();
        const customer = await _stripe.customers.create({
            name,
            address,
            email,
            phone, 
            metadata: {
                subdomainId: subdomain.id
            }
        });

        // if(card) {
        //     const token = await _stripe.tokens.create({
        //         card: {
        //             name,
        //             exp_month: card.expMonth.toString(),
        //             exp_year: card.expYear.toString(),
        //             number: card.number,
        //             cvc: card.cvc,
        //             address_city: address.city,
        //             address_country: address.country,
        //             address_line1: address.line1,
        //             address_line2: address.line2,
        //             address_state: address.state,
        //             address_zip: address.zip,
        //         }
        //     });
        //     await _stripe.customers.createSource(customer.id, {
        //         source: `${token.id}`,
        //     });
        // }

        return customer;
    }

    async subscribeRootPlan(customerId: string, unitAmount: number, currency: string, productId: string, trialEnd?: number | 'now') {
        const _stripe = await this._createRootInstance();
        const subscription = await _stripe.subscriptions.create({
            customer: customerId,
            trial_end: trialEnd,
            items: [
                {
                    price_data: {
                        unit_amount: unitAmount,
                        currency,
                        product: productId,
                        recurring: {
                            interval: 'month',
                        },
                    },
                },
            ],
        });

        return subscription;
    }

    async updateRootCustomer(id: string, {name, email, phone, address, card}: RegisterRootPackageDto) {
        const _stripe = await this._createRootInstance();
        const customer = await _stripe.customers.update(id, {
            email, phone
        });

        if(card) {
            const token = await _stripe.tokens.create({
                card: {
                    name,
                    exp_month: card.expMonth.toString(),
                    exp_year: card.expYear.toString(),
                    number: card.number,
                    cvc: card.cvc,
                    address_city: address.city,
                    address_country: address.country,
                    address_line1: address.line1,
                    address_line2: address.line2,
                    address_state: address.state,
                },
                customer: customer.id
            });
            await _stripe.customers.createSource(customer.id, {
                source: `${token.id}`,
            });
        }

        return customer;
    }
}

interface IInvoiceItem {
    unit_amount?: number;
    quantity?: number;
    description?: string;
    amount?: number;
}
