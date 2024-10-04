import {BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { join } from 'path';
import { SUBDOMAINS_EXIST } from 'src/common/constants';
import { Encrypt } from 'src/helpers/encrypt';
import { SendEmailHelper } from 'src/helpers/send-email';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterSubdomainDto } from './dto/register-subdomain.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { StripeHelper } from 'src/helpers/stripe';
import { UpdateExpireTimeDto } from './dto/update-expire-time.dto';
import { SubdomainPlansService } from '../subdomain-plans/subdomain-plans.service';
import { PaypalHelper } from 'src/helpers/paypal';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

@Injectable()
export class SubdomainService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly subdomainPlanService: SubdomainPlansService,
        private readonly stripeHelper: StripeHelper,
        private readonly paypalHelper: PaypalHelper,
        private jwtService: JwtService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async getSubdomainConfig(subdomain: string) {
        // const result = await this.prisma.subdomain.findFirst({
        //     where: {
        //         name: subdomain,
        //     },
        //     select: {
        //         name: true,
        //         id: true,
        //         isActive: true,
        //         expiredAt: true,
        //         subdomainTheme: true,
        //         title: true,
        //         description: true,
        //         keyword: true,
        //         setting: {
        //             select: {
        //                 address: true,
        //                 contactNumber: true,
        //                 email: true,
        //                 socialLinks: true,
        //                 supportLinks: true,
        //             },
        //         },
        //         subdomainSocialLinks: true,
        //     },
        // });
        const result = await this.db
            .selectFrom('Subdomain')
            .where('name', '=', subdomain)
            .select(eb => [
                'name',
                'id',
                'isActive',
                'expiredAt',
                jsonObjectFrom(eb
                    .selectFrom('SubdomainTheme')
                    .whereRef('id', '=', 'Subdomain.subdomainThemeId')
                    .selectAll()
                ).as('subdomainTheme'),
                'title',
                'description',
                'keyword',
                jsonObjectFrom(eb
                    .selectFrom('SubdomainSetting')
                    .whereRef('subdomainId', '=', 'Subdomain.id')
                    .select(['address', 'contactNumber', 'email', 'socialLinks', 'supportLinks'])
                ).as('setting'),
                jsonArrayFrom(eb
                    .selectFrom('SubdomainSocialLink')
                    .whereRef('subdomainId', '=', 'Subdomain.id')
                    .selectAll()
                ).as('subdomainSocialLinks'),
            ])
            .executeTakeFirst();

        return result;
    }

    async checkSubdomain(domainName: string) {
        const subdomainString = domainName.toLocaleLowerCase();
        const subdomain = await this.prisma.subdomain.findFirst({
            where: {
                name: subdomainString,
            },
        });

        if (subdomain || SUBDOMAINS_EXIST.includes(subdomainString)) {
            throw new BadRequestException('Subdomain name already exist!');
        }

        return true;
    }

    async registerSubdomain(body: RegisterSubdomainDto) {
        const {
            domainName,
            email,
            firstName,
            lastName,
            password,
            planKey,
            theme,
            billing,
            description,
            languageSpoken,
            languagesTeaching,
        } = body;

        const subdomainString = domainName.toLowerCase();
        /**
         * Check subdomain & admin account
         */
        const [subdomainExist, subdomainAdmin, plan, language] =
            await Promise.all([
                this.prisma.subdomain.findFirst({
                    where: {
                        name: subdomainString,
                    },
                }),
                this.prisma.user.findFirst({
                    where: {
                        email,
                        role: 'SUBDOMAIN_ADMIN',
                    },
                }),
                this.prisma.subdomainPlan.findFirst({
                    where: {
                        key: planKey,
                    },
                    include: {
                        storageProratedPrices: true,
                        studentProratedPrices: true,
                    },
                }),
                this.prisma.courseLanguage.findFirst({
                    where: {
                        id: languageSpoken,
                    },
                }),
            ]);

        if (subdomainExist || SUBDOMAINS_EXIST.includes(subdomainString))
            throw new BadRequestException('Subdomain name already exists!');
        if (subdomainAdmin)
            throw new BadRequestException('Registration email already exists!');
        if (!plan) throw new BadRequestException('Subdomain plan wrong!');
        if (!language) throw new BadRequestException('Language not found!');

        /**
         * Create subdomain
         */
        const subdomain = await this.prisma.subdomain.create({
            include: {
                users: {
                    take: 1,
                },
            },
            data: {
                name: domainName,
                isActive: false,
                subdomainTheme: {
                    create: theme,
                },
                subdomainBilling: {
                    create: {
                        firstName,
                        lastName,
                        email,
                        subdomainPlanId: plan.id,
                        city: billing.city,
                        companyName: billing.companyName,
                        state: billing.state,
                        phoneNumber: billing.phoneNumber,
                        paymentMethod: billing.paymentMethod,
                        country: billing.country,
                        streetAddress: billing.streetAddress,
                        coupon: billing.coupon,
                    },
                },
                users: {
                    create: {
                        email,
                        password: await Encrypt.cryptPassword(password),
                        role: 'SUBDOMAIN_ADMIN',
                        profile: {
                            create: {
                                address: billing.streetAddress,
                                city: billing.city,
                                country: billing.country,
                                description,
                                firstName,
                                lastName,
                                languageCode: languageSpoken,
                                phoneNumber: billing.phoneNumber,
                                state: billing.state,
                                // instructor: {
                                //     create: {
                                //         // teachLanguages: [1],
                                //     },
                                // },
                            },
                        },
                    },
                },
                expiredAt: moment().add(plan.daysTrial, 'days').toDate(),
            },
        });

        if (billing.paymentMethod === 'STRIPE') {
            const customer = await this.stripeHelper.createRootCustomer(
                subdomain,
                {
                    name: `${firstName} ${lastName}`,
                    email,
                    phone: billing.phoneNumber,
                    address: {
                        city: billing.city,
                        country: billing.country,
                        line1: billing.companyName,
                        line2: billing.streetAddress,
                        state: billing.state,
                    },
                }
            );
            await this.prisma.subdomainBilling.update({
                where: {
                    subdomainId: subdomain.id,
                },
                data: {
                    stripeId: customer.id,
                },
            });
        }

        /**
         * Send verify email
         */
        await this.sendVerifySubdomainEmail(
            subdomain.id,
            email,
            `${subdomainString}.immersio.io`,
            {
                firstName,
            }
        );

        return this.subdomainPlanService.checkout(
            subdomain.id,
            subdomain.users[0].id
        );
    }

    private async sendVerifySubdomainEmail(
        subdomainId: string,
        email: string,
        subdomain: string,
        { firstName }: any
    ) {
        const token = this.jwtService.sign({
            email: email,
            type: 'VERIFY_SUBDOMAIN_EMAIL',
            subdomainId: subdomainId,
        });

        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const verifyPath = join(
            __dirname,
            './../../../client/html/verify-email.html'
        );
        const confirmMsg =
            'Please confirm your email so you can begin your journey.';
        const confirmInfo =
            'By confirming, you\'ll be subscribed to our suggested notifications. You can customize your settings or unsubscribe anytime.';

        const body = _emailHelper.buildStringTemplate(verifyPath, {
            firstName,
            link: `https://immersio.io/verify-subdomain?hashcode=${token}`,
            confirmMsg,
            confirmInfo,
        });

        _emailHelper.send(
            email,
            'Confirm your Email and Subdomain with Immersio',
            templatePath,
            {
                body,
                email,
                year: new Date().getFullYear(),
                subdomain,
            }
        );
    }

    async verifySubdomain(token: string) {
        const data = this.jwtService.verify(token);

        const { type, email, subdomainId } = data;

        if (type !== 'VERIFY_SUBDOMAIN_EMAIL')
            throw new InternalServerErrorException();

        const user = await this.prisma.user.findFirst({
            where: {
                email,
                subdomainId,
            },
        });

        if (!user)
            throw new NotFoundException('Your account is not registered');

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isVerified: true,
            },
        });

        const subdomain = await this.prisma.subdomain.findFirst({
            where: {
                id: subdomainId,
            },
        });

        if (!subdomain)
            throw new NotFoundException('Sub domain is not registered');

        await this.prisma.subdomain.update({
            where: {
                id: subdomainId,
            },
            data: {
                isActive: true,
            },
        });

        return true;
    }

    async updateBillingInfo(subdomainId: string, data: UpdateBillingDto) {
        const result = await this.prisma.subdomainBilling.upsert({
            where: {
                subdomainId,
            },
            create: {
                subdomainId,
                ...data,
            },
            update: data,
            include: {
                subdomain: true,
            },
        });

        if (!result.stripeId) {
            const customer = await this.stripeHelper.createRootCustomer(
                result.subdomain,
                {
                    name: `${result.firstName} ${result.lastName}`,
                    email: result.email,
                    phone: result.phoneNumber,
                    address: {
                        city: result.city,
                        country: result.country,
                        line1: result.companyName,
                        line2: result.streetAddress,
                        state: result.state,
                    },
                }
            );
            console.log(customer);
            await this.prisma.subdomainBilling.update({
                where: {
                    subdomainId,
                },
                data: {
                    stripeId: customer.id,
                },
            });
            //TODO: Update paypal account if needed
        }

        return true;
    }

    async getSubdomainPlan(planKey: string) {
        const plan = await this.prisma.subdomainPlan.findFirst({
            where: {
                key: planKey,
            },
        });

        if (!plan)
            throw new NotFoundException('Subdomain plan is not registered');

        return plan;
    }

    async updateExpireTime({ subodmainId, expiredAt }: UpdateExpireTimeDto) {
        await this.prisma.subdomain.update({
            where: {
                id: subodmainId,
            },
            data: {
                expiredAt,
            },
        });

        return true;
    }
}
