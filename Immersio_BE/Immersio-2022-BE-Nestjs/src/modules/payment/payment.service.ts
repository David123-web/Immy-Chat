import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { StripeHelper } from 'src/helpers/stripe';
import { PrismaService } from '../prisma/prisma.service';
import { PaypalHelper } from 'src/helpers/paypal';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Role, RootSettingKey, Subdomain } from '@prisma/client';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SendEmailHelper } from '../../helpers/send-email';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { ProductTypes } from 'src/constants/business-constants';

@Injectable()
export class PaymentService implements OnModuleInit {
    constructor(
    private readonly stripeHelper: StripeHelper,
    private readonly paypalHelper: PaypalHelper,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @InjectKysely() private db: Kysely<DB>
    ) {}

    onModuleInit() {
    //Add webhook -> immersio's stripe account
        this.initRootStripeWebhook();
        //Add webhook -> immersio's paypal account
        this.initRootPaypalWebhook();
    }

    async initRootStripeWebhook() {
    //TODO: URL should be replace with api.immersio.io on PROD
        const url = 'https://api.immersio.io/payment/stripe/webhook';
        const stripe = await this.stripeHelper._createRootInstance();
        const list = await stripe.webhookEndpoints.list();
        if (!list.data.find((d) => d.url === url))
            await stripe.webhookEndpoints.create({
                enabled_events: ['*'],
                url,
            });
    // await stripe.webhookEndpoints.del(list.data.find(d => d.url === url).id)
    }
    async initRootPaypalWebhook() {
    //TODO: URL should be replace with api.immersio.io on PROD
        const url = 'https://api.immersio.io/payment/paypal/webhook';
        const paypal = await this.paypalHelper._createRootInstance();
        paypal.notification.webhook.list({
        }, null, (err, response) => {
            if (response && !response.webhooks.find((w) => w.url === url)) {
                paypal.notification.webhook.create(
                    {
                        event_types: [
                            {
                                name: '*',
                                description: 'ALL',
                                status: 'ENABLED',
                            },
                        ],
                        url,
                    },
                    null,
                    (err, response) => {
                        console.log(response);
                    }
                );
            }
        });
    }

  @Cron(CronExpression.EVERY_HOUR, {
      disabled: process.env.ENABLE_PAYMENT_CRON !== 'true',
  })
    async checkAndIssueInvoice() {
        const daysRemind = (await this.prisma.rootSetting.findFirst({
            where: {
                key: RootSettingKey.DAYS_BEFORE_EXPIRATION_REMINDER,
            },
        })) ?? {
            value: 3,
        };
        console.log('Days remind:', daysRemind);
        const subdomains = await this.prisma.subdomain.findMany({
            where: {
                expiredAt: {
                    lte: moment()
                        .add(Math.max(+daysRemind?.value, 0), 'days')
                        .toISOString(),
                },
            },
            include: {
                subdomainBilling: {
                    include: {
                        subdomainPlan: {
                            include: {
                                storageProratedPrices: true,
                                studentProratedPrices: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        users: {
                            where: {
                                role: Role.STUDENT,
                            },
                        },
                    },
                },
            },
        });

        console.log(
            'Subdomain detected:',
            subdomains.map((s) => s.id)
        );

        subdomains.forEach(async (subdomain) => {
            const reminds = Math.max(+daysRemind?.value, 0);
            const daysUntilDue = Math.max(
                -moment().diff(subdomain.expiredAt, 'd'),
                0
            );

            const sendInvoiceCount = subdomain.sendInvoiceCount;

            if (daysUntilDue < reminds && sendInvoiceCount < 1) {
                await this._issueInvoice(subdomain);
            }

            //auto charge invoice
            if (subdomain.subdomainBilling.latestInvoiceId) {
                const latestInvoice = await this.prisma.invoice.findUnique({
                    where: {
                        refId: subdomain.subdomainBilling.latestInvoiceId,
                    },
                });
                if (
                    daysUntilDue <= 0 &&
          (latestInvoice?.status == 'PENDING' ||
            latestInvoice?.status == 'OVER_DUE')
                ) {
                    await this.chargeInvoice(subdomain, latestInvoice.refId);
                }
            }
        });
    }

  async getProductTypes() {
      return Object.values(ProductTypes);
  }

  async chargeInvoice(subdomain: Subdomain | any, invoiceId: string) {
      const stripe = await this.stripeHelper._createRootInstance();
      if (invoiceId != null) {
          const invoice = await stripe.invoices.retrieve(invoiceId);
          try {
              if (invoice.status == 'open') await stripe.invoices.pay(invoiceId);
          } catch (error) {}
      }
  }

  async sendReminder(subdomain: Subdomain | any) {
      if (subdomain.remindCount < 1) {
          const templatePath = join(
              __dirname,
              './../../../client/html/remind-billing.html' //TODO: (Boi) email template
          );

          const amount = await this.calculateAmount(subdomain);

          const _emailHelper = new SendEmailHelper();
          _emailHelper.send(
              subdomain.subdomainBilling.email,
              `Payment request for ${subdomain.expiredAt}`,
              templatePath,
              {
                  firstName: subdomain.name,
                  lastName: '',
                  nextPaymentDate: subdomain.expiredAt,
                  proratedAmount: amount,
                  currentBillingStartDate: moment(subdomain.expiredAt).subtract(
                      30,
                      'days'
                  ),
                  monthEndDate: subdomain.expiredAt,
              }
          );

          await this.prisma.subdomain.update({
              data: {
                  remindCount: subdomain.remindCount + 1,
              },
              where: {
                  id: subdomain.id,
              },
          });
      }
  }

  async calculateAmount(subdomain: Subdomain | any) {
      const subdomainBilling = subdomain.subdomainBilling;
      if (!subdomainBilling)
          throw new NotFoundException('Subdomain billing not found!');
      const subdomainPlan = subdomainBilling.subdomainPlan;
      if (!subdomainPlan) throw new NotFoundException('Plan not found!');
      if (!subdomainBilling.paymentMethod)
          throw new NotFoundException('Payment method not found!');

      let student = subdomain._count.users;
      let amount = 0;
      const subdomainFiles = await this.prisma.file.aggregate({
          where: {
              user: {
                  subdomainId: subdomain.id,
              },
          },
          _sum: {
              size: true,
          },
      });
      let totalStorage = subdomainFiles._sum.size / 2 ** 30;

      const sortedStudentProratedPrices =
      subdomainPlan.studentProratedPrices.sort(
          (a, b) => b.studentMinimum - a.studentMinimum
      );
      const sortedStorageProratedPrices =
      subdomainPlan.storageProratedPrices.sort(
          (a, b) => b.storageMinimum - a.storageMinimum
      );

      sortedStudentProratedPrices.forEach((pp) => {
          if (student >= pp.studentMinimum) {
              const studentToCharge =
          student - (pp.studentMinimum - 1 > 0 ? pp.studentMinimum - 1 : 0);
              student -= studentToCharge;
              amount += studentToCharge * pp.price;
          }
      });

      sortedStorageProratedPrices.forEach((pp) => {
          if (totalStorage >= pp.storageMinimum) {
              const storageToCharge = totalStorage - pp.storageMinimum;
              totalStorage -= storageToCharge;
              amount += storageToCharge * pp.price;
          }
      });

      //Calculate discount
      amount = Math.max(amount, subdomainPlan.minimumCharge);

      try {
          const coupon = await this.prisma.coupon.findFirst({
              where: {
                  subdomainId: null,
                  code: subdomainBilling?.coupon,
                  usedBy: {
                      none: {
                          subdomainId: subdomain.id,
                      },
                  },
              },
          });
          let useCoupon = true;
          let discountAmount = 0;
          if (coupon && coupon.totalUsed < coupon.limit) {
              if (
                  coupon.type === 'AMOUNT' &&
          coupon.currency === subdomainPlan.currency
              ) {
                  discountAmount = coupon.value;
              } else if (coupon.type === 'PERCENT') {
                  discountAmount = (amount * coupon.value) / 100;
              } else {
                  useCoupon = false;
              }
          }
          amount = Math.max(0, amount - discountAmount);
      } catch (error) {}

      return amount;
  }

  async _issueInvoice(subdomain: Subdomain | any) {
      //Check if can create invoice for subdomain
      const subdomainBilling = subdomain.subdomainBilling;
      if (!subdomainBilling)
          throw new NotFoundException('Subdomain billing not found!');
      const subdomainPlan = subdomainBilling.subdomainPlan;
      if (!subdomainPlan) throw new NotFoundException('Plan not found!');
      if (!subdomainBilling.paymentMethod)
          throw new NotFoundException('Payment method not found!');

      //Calculate total amount for invoice
      const daysUntilDue = Math.max(-moment().diff(subdomain.expiredAt, 'd'), 0);
      const amount = await this.calculateAmount(subdomain);

      if (subdomain.subdomainBilling.paymentMethod === 'STRIPE') {
          const stripe = await this.stripeHelper._createRootInstance();
          const user = await this.prisma.user.findFirst({
              where: {
                  subdomainId: subdomain.id,
                  email: subdomainBilling.email,
              },
          });
          const invoice = await stripe.invoices.create({
              customer: subdomain.subdomainBilling.stripeId,
              currency: (
                  subdomain.subdomainBilling.subdomainPlan.currency || 'usd'
              ).toLowerCase(),
              collection_method: 'send_invoice',
              days_until_due: moment(daysUntilDue).unix(),
              metadata: {
                  type: 'subdomain_billing',
                  userId: user.id,
              },
          });

          await stripe.invoiceItems.create({
              invoice: invoice.id,
              customer: subdomain.subdomainBilling.stripeId,
              amount: amount * 100,
          });

          await stripe.invoices.finalizeInvoice(invoice.id);

          // await stripe.invoices.sendInvoice(invoice.id);
          this.sendReminder(subdomain);

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

          await this.prisma.invoice.upsert({
              where: {
                  refId: invoice.id,
              },
              create: {
                  refId: invoice.id,
                  amount: invoice.amount_due,
                  currency: invoice.currency.toUpperCase(),
                  method: 'STRIPE',
                  subdomainId: subdomain.id,
                  subdomainPlanId: subdomainPlan.id,
                  numberInMonth: latestInvoice ? latestInvoice.numberInMonth + 1 : 1,
              },
              update: {
                  amount: invoice.amount_due,
                  currency: invoice.currency.toUpperCase(),
                  method: 'STRIPE',
                  subdomainId: subdomain.id,
                  subdomainPlanId: subdomainPlan.id,
                  numberInMonth: latestInvoice ? latestInvoice.numberInMonth + 1 : 1,
              },
          });
          //Update subdomain send invoice count and link ref id to subdomainBilling
          await this.prisma.subdomain.update({
              where: {
                  id: subdomain.id,
              },
              data: {
                  sendInvoiceCount: subdomain.sendInvoiceCount + 1,
                  subdomainBilling: {
                      update: {
                          latestInvoiceId: invoice.id,
                      },
                  },
              },
          });

          return amount;
      } else if (subdomain.subdomainBilling.paymentMethod === 'PAYPAL') {
          const paypal = await this.paypalHelper._createRootInstance();
          paypal.invoice.create(
              {
                  reference: subdomain.id,
                  // invoice_date: moment().add(1, 'd').format('yyyy-MM-dd z'),
                  merchant_info: {
                      business_name: 'Immersio',
                      website: 'https://immersio.io',
                  },
                  paid_amount: {
                      paypal: {
                          currency: subdomainPlan.currency,
                          value: amount.toString(),
                      },
                      other: {
                          currency: subdomainPlan.currency,
                          value: amount.toString(),
                      },
                  },
                  billing_info: [
                      {
                          first_name: subdomain.subdomainBilling.firstName,
                          last_name: subdomain.subdomainBilling.lastName,
                          business_name: subdomain.subdomainBilling.companyName,
                          // address: {
                          //     city: subdomain.subdomainBilling.city,
                          //     phone: subdomain.subdomainBilling.phoneNumber,
                          //     line1: subdomain.subdomainBilling.streetAddress,
                          //     line2: subdomain.subdomainBilling.state,
                          //     state: subdomain.subdomainBilling.state,
                          // }
                          email: subdomain.subdomainBilling.email,
                          additional_info: subdomain.id,
                      },
                  ],
              },
              (error, invoice) => {
                  // paypal.invoice.send()
                  paypal.invoice.send(invoice.id, (sendError, sendResponse) => {
                      if (sendError) {
                          console.error(sendError);
                      } else {
                          console.log('Invoice sent successfully:', sendResponse);
                      }
                  });
              }
          );
      }

      //Update that subdomain has used coupon
      const coupon = await this.prisma.coupon.findUnique({
          where: {
              subdomainId_code: {
                  subdomainId: subdomain.id,
                  code: subdomainBilling.coupon,
              },
              usedBy: {
                  none: {
                      subdomainId: subdomain.id,
                  },
              },
          },
      });

      //TODO: (Thanh) check coupon update
      let useCoupon = true;
      const discountAmount = 0;
      if (coupon && coupon.totalUsed < coupon.limit) {
          if (
              coupon.type === 'AMOUNT' &&
        coupon.currency === subdomainPlan.currency
          ) {
              // discountAmount = coupon.value;
          } else if (coupon.type === 'PERCENT') {
              // discountAmount = (amount * coupon.value) / 100;
          } else {
              useCoupon = false;
          }
      }
      if (coupon && useCoupon)
          await this.prisma.couponUsedBy.create({
              data: {
                  couponId: coupon.id,
                  subdomainId: subdomain.id,
              },
          });
  }
}
