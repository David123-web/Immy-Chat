import { Injectable } from '@nestjs/common';
import {ForbiddenException,
    NotFoundException,} from '@nestjs/common/exceptions';
import { PaymentGatewayType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOnlinePaymentGatewayDto } from './dto/update-online-payment-gateway.dto';

@Injectable()
export class OnlinePaymentGatewaysService {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        return this.prisma.onlinePaymentGateWay.findMany({
            where: {
                subdomain: user.role === 'SUPER_ADMIN' ? null : {
                    users: {
                        some: {
                            id: userId 
                        } 
                    } 
                } 
            },
            select: {
                clientId: true,
                id: true,
                isActivated: true,
                subdomainId: true,
                type: true
            }
        });
    }

    async findOne(type: PaymentGatewayType, subdomainId: string) {
        const result = await this.prisma.onlinePaymentGateWay.findUnique({
            where: {
                subdomainId_type: {
                    subdomainId: subdomainId || null, type 
                } 
            },
        });
        if (!result) throw new NotFoundException();
        return result;
    }

    async update(
        userId: string,
        { subdomainId, type, ...data }: UpdateOnlinePaymentGatewayDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        if ((user.subdomainId !== subdomainId) && user.role === 'SUBDOMAIN_ADMIN') throw new ForbiddenException();
        switch (user.role) {
        case 'SUBDOMAIN_ADMIN':
            await this.prisma.onlinePaymentGateWay.upsert({
                where: {
                    subdomainId_type: {
                        subdomainId, type 
                    } 
                },
                create: {
                    subdomainId, type, ...data 
                },
                update: {
                    subdomainId, type, ...data 
                },
            });
            break;
        case 'SUPER_ADMIN':
            const gateway = await this.prisma.onlinePaymentGateWay.findFirst({
                where: {
                    subdomainId: subdomainId || null, type 
                } 
            });
            if (gateway) {
                await this.prisma.onlinePaymentGateWay.update({
                    where: {
                        id: gateway.id 
                    }, data
                });
            } else {
                await this.prisma.onlinePaymentGateWay.create({
                    data: {
                        subdomainId: subdomainId || null, type, ...data 
                    }
                });
            }
        }

        return true;
    }
}
