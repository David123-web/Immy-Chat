import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { PaginationSortDto } from 'src/common/dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfflinePaymentGatewayDto } from './dto/create-offline-payment-gateway.dto';
import { UpdateOfflinePaymentGatewayDto } from './dto/update-offline-payment-gateway.dto';

@Injectable()
export class OfflinePaymentGatewaysService {
    constructor(private readonly prisma: PrismaService) {}
    async create(
        userId: string,
        createOfflinePaymentGatewayDto: CreateOfflinePaymentGatewayDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        await this.prisma.offlinePaymentGateway.create({
            data: {
                subdomainId: user.subdomainId,
                ...createOfflinePaymentGatewayDto,
            },
        });
        return true;
    }

    async findAll(
        userId: string,
        { skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto
    ) {
        const [total, data] = await Promise.all([
            this.prisma.offlinePaymentGateway.count({
                where: {
                    subdomain: {
                        users: {
                            some: {
                                id: userId 
                            } 
                        } 
                    } 
                },
            }),
            this.prisma.offlinePaymentGateway.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId 
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc ? 'desc' : 'asc' 
                },
                where: {
                    subdomain: {
                        users: {
                            some: {
                                id: userId 
                            } 
                        } 
                    } 
                },
            }),
        ]);

        return {
            total, data 
        };
    }

    async findOne(id: string) {
        const result = await this.prisma.offlinePaymentGateway.findUnique({
            where: {
                id 
            },
        });
        if (!result) throw new NotFoundException();
        return result;
    }

    async update(
        userId: string,
        id: string,
        updateOfflinePaymentGatewayDto: UpdateOfflinePaymentGatewayDto
    ) {
        const result = await this.findOne(id);
        const isBelong = await this._isUserBelongToSubdomain(
            userId,
            result.subdomainId
        );
        if (!isBelong) throw new ForbiddenException();
        await this.prisma.offlinePaymentGateway.update({
            where: {
                id 
            },
            data: updateOfflinePaymentGatewayDto,
        });
        return true;
    }

    async remove(userId: string, id: string) {
        const result = await this.findOne(id);
        const isBelong = await this._isUserBelongToSubdomain(
            userId,
            result.subdomainId
        );
        if (!isBelong) throw new ForbiddenException();
        await this.prisma.offlinePaymentGateway.delete({
            where: {
                id 
            } 
        });
        return true;
    }

    private async _isUserBelongToSubdomain(userId: string, subdomainId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        return user.subdomainId === subdomainId;
    }
}
