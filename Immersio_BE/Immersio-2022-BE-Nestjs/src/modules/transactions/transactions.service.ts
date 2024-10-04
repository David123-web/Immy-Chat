import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationSortDto } from 'src/common/dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        subdomainId: string,
        { userId: id, ...data }: CreateTransactionDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id 
            } 
        });
        if (!user || user.subdomainId !== subdomainId)
            throw new NotFoundException('User not found!');
        if (user.subdomainId === subdomainId)
            return this.prisma.user.update({
                where: {
                    id 
                },
                data: {
                    transactions: {
                        create: {
                            subdomainId,
                            currency: 'USD',
                            ...data,
                        },
                    },
                },
            });
    //Send email to confirm transaction
    }

    async findAll(
        userId: string,
        { skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const [result, total] = await Promise.all([
            this.prisma.transaction.findMany({
                skip,
                take,
                where: user.role === 'SUBDOMAIN_ADMIN' ? undefined : {
                    userId 
                },
                cursor: cursorId && {
                    id: cursorId 
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc 
                },
                include: {
                    subdomain : {
                        select: {
                            subdomainBilling: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            }),
            this.prisma.transaction.count({
                where: user.role === 'SUBDOMAIN_ADMIN' ? undefined : {
                    userId 
                } 
            })
        ]);

        return ({
            total,
            result
        });
    }

    async findOne(id: string) {
        const transaction = this.prisma.transaction.findUnique({
            where: {
                id 
            },
            include: {
                subdomain: {
                    select: {
                        expiredAt: true,
                        subdomainBilling: true
                    }
                },
                invoice: true
            }
        });
        if (!transaction) throw new NotFoundException();
        return transaction;
    }
}
