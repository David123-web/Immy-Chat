import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';
import { Role } from '@prisma/client';
import * as moment from 'moment';
import { StripeHelper } from 'src/helpers/stripe';
import { PaypalHelper } from 'src/helpers/paypal';

@Injectable()
export class CouponsService {
    constructor(private readonly prisma: PrismaService,
        private readonly stripeHelper: StripeHelper,
        private readonly paypalHelper: PaypalHelper
    ) { }
    async create(subdomainId: string, userId: string, { subscriptionPlanIds, subdomainPlanIds, ...data }: CreateCouponDto) {
        const coupon = await this.prisma.coupon.findUnique({
            where: {
                subdomainId_code: {
                    subdomainId, code: data.code 
                } 
            } 
        });
        if(coupon) throw new BadRequestException('Coupon already existed!');
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        // const promotionCode = await this._createStripeCoupon({subdomainPlanIds, subscriptionPlanIds, ...data})
        console.log({
            connect: subdomainPlanIds.map(id => ({
                id
            }))
        });
        switch (user.role) {
        case Role.SUPER_ADMIN:
            return this.prisma.coupon.create({
                data: {
                    // stripeId: promotionCode.id,
                    subdomainPlans: subdomainPlanIds ? {
                        connect: subdomainPlanIds.map(id => ({
                            id
                        }))
                    } : undefined,
                    ...data,
                },
            });
        case Role.SUBDOMAIN_ADMIN:
            return this.prisma.coupon.create({
                data: {
                    // stripeId: promotionCode.id,
                    subdomain: {
                        connect: {
                            id: subdomainId
                        }
                    },
                    subscriptionPlans: subscriptionPlanIds ? {
                        connect: subscriptionPlanIds.map(id => ({
                            id
                        }))
                    } : undefined,
                    ...data,
                },
            });
        default:
            throw new ForbiddenException();
        }
    }

    async findAll(
        subdomainId: string,
        userId: string,
        { skip, take, cursorId, sortBy, sortDesc, isDeleted }: PaginationSortDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        const [result, total] = await Promise.all([
            this.prisma.coupon.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId
                },
                where: {
                    subdomainId: user.role === Role.SUPER_ADMIN ? null : subdomainId, isDeleted: isDeleted || false
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc ? 'desc' : 'asc'
                },
            }),
            this.prisma.coupon.count({
                where: {
                    subdomainId: user.role === Role.SUPER_ADMIN ? null : subdomainId, isDeleted: isDeleted || false
                },
            })
        ]);

        return ({
            result: result.map(r => ({
                ...r, status: this._checkCouponStatus(r.startAt, r.endAt)
            })), total
        });
    }

    private _checkCouponStatus(startAt: Date, endAt: Date) {
        if (moment(startAt).isAfter()) return 'INACTIVE';
        if (moment(startAt).isBefore() && moment(endAt).isAfter()) return 'ACTIVE';
        if (moment(endAt).isBefore()) return 'EXPIRED';
        throw new InternalServerErrorException();
    }

    async findAllPublic(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto
    ) {
        const [result, total] = await Promise.all([
            this.prisma.coupon.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId
                },
                where: {
                    subdomainId, isDeleted: false
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc ? 'desc' : 'asc'
                },
            }),
            this.prisma.coupon.count({
                where: {
                    subdomainId, isDeleted: false
                },
            })
        ]);

        return ({
            result: result.map(r => ({
                ...r, status: this._checkCouponStatus(r.startAt, r.endAt)
            })), total
        });
    }

    async findOne(subdomainId: string, id: string, withDeleted = false) {
        const coupon = await this.prisma.coupon.findUnique({
            where: {
                id
            },
            include: {
                subscriptionPlans: true
            }
        });
        if (!coupon || coupon.subdomainId !== subdomainId || (withDeleted ? false : coupon.isDeleted))
            throw new NotFoundException('Coupon not found!');
        return coupon;
    }

    async update(subdomainId: string, userId: string, id: string, { subscriptionPlanIds, subdomainPlanIds, ...data }: UpdateCouponDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const coupon = await this.prisma.coupon.findUnique({
            where: {
                id
            }, include: {
                subdomainPlans: true,
                subscriptionPlans: true
            }
        });
        switch (user.role) {
        case Role.SUPER_ADMIN:
            await this.prisma.coupon.update({
                where: {
                    id
                }, data: {
                    subdomainPlans: subdomainPlanIds ? {
                        connect: subdomainPlanIds.filter(id => !coupon.subdomainPlans.map(f => f.id).includes(id)).map(id => ({
                            id
                        })),
                        disconnect: coupon.subdomainPlans.map(f => f.id).filter(id => !subdomainPlanIds.includes(id)).map(id => ({
                            id
                        }))
                    } : undefined, ...data
                }
            });
            return true;
        case Role.SUBDOMAIN_ADMIN:
            if (coupon.subdomainId !== subdomainId) throw new ForbiddenException();
            await this.prisma.coupon.update({
                where: {
                    id
                }, data: {
                    subscriptionPlans: subscriptionPlanIds ? {
                        connect: subscriptionPlanIds.filter(id => !coupon.subscriptionPlans.map(f => f.id).includes(id)).map(id => ({
                            id
                        })),
                        disconnect: coupon.subscriptionPlans.map(f => f.id).filter(id => !subscriptionPlanIds.includes(id)).map(id => ({
                            id
                        }))
                    } : undefined, ...data
                }
            });
            return true;
        default:
            throw new ForbiddenException();
        }
    }

    async restore(subdomainId: string, userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        switch (user.role) {
        case Role.SUPER_ADMIN:
            await this.prisma.coupon.update({
                where: {
                    id
                },
                data: {
                    isDeleted: false
                },
            });
            return true;
        case Role.SUBDOMAIN_ADMIN:
            await this.findOne(subdomainId, id, true);
            await this.prisma.coupon.update({
                where: {
                    id
                },
                data: {
                    isDeleted: false
                },
            });
            return true;
        default:
            throw new ForbiddenException();
        }
    }

    async remove(subdomainId: string, userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        switch (user.role) {
        case Role.SUPER_ADMIN:
            await this.prisma.coupon.update({
                where: {
                    id
                },
                data: {
                    isDeleted: true
                },
            });
            return true;
        case Role.SUBDOMAIN_ADMIN:
            await this.findOne(subdomainId, id);
            await this.prisma.coupon.update({
                where: {
                    id
                },
                data: {
                    isDeleted: true
                },
            });
            return true;
        default:
            throw new ForbiddenException();
        }
    }

    async _createStripeCoupon(data: CreateCouponDto) {
        let productIds = [];
        if (data.subdomainPlanIds && data.subdomainPlanIds.length) {
            const subdomainPlan = await this.prisma.subdomainPlan.findMany({
                where: {
                    id: {
                        in: data.subdomainPlanIds 
                    } 
                } 
            });
            productIds = subdomainPlan.map(i => i.stripeProductId);
        } else if (data.subscriptionPlanIds && data.subscriptionPlanIds.length) {
            const subscriptionPlan = await this.prisma.subscriptionPlan.findMany({
                where: {
                    id: {
                        in: data.subscriptionPlanIds 
                    } 
                } 
            });
            productIds = subscriptionPlan.map(i => i.stripeProductId);
        }
        const stripe = await this.stripeHelper._createRootInstance();
        const coupon = await stripe.coupons.create({
            name: data.name,
            max_redemptions: data.limit,
            percent_off: data.type === 'PERCENT' ? data.value : undefined,
            amount_off: data.type === 'AMOUNT' ? data.value : undefined,
            currency: 'usd',
            applies_to: {
                products: productIds
            }
        });

        const promotionCode = await stripe.promotionCodes.create({
            coupon: coupon.id,
            code: data.code,
            expires_at: moment(data.endAt).unix(),
            max_redemptions: data.limit
        });

        return promotionCode;
    }

    async permanentRemove(subdomainId: string, userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (user.role !== Role.SUPER_ADMIN) await this.findOne(subdomainId, id);
        await this.prisma.coupon.delete({
            where: {
                id
            },
        });
        return true;
    }
}