import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { SearchParamsDto } from '../../common/dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) {}

    create(createInvoiceDto: CreateInvoiceDto) {
        return 'This action adds a new invoice';
    }

    async findAll(search: SearchParamsDto) {
        const pagination = {
            cursor: search.cursorId && {
                id: search.cursorId,
            },
            orderBy: search.sortBy
                ? {
                    [search.sortBy]: search.sortDesc ? 'desc' : 'asc',
                }
                : undefined,
            take: search.take,
            skip: search.skip,
        };

        const _searchByOptions = ['clientDomain', 'transactionId', 'plan'];

        if (!_searchByOptions.includes(search.searchBy) && search.searchBy) {
            throw new BadRequestException(
                'searchBy must be transactionId, clientDomain, or plan'
            );
        }

        const searchObject = {
        };

        if (search.searchBy === 'clientDomain' && search.searchKey) {
            searchObject['subdomain'] = {
                name: {
                    contains: search.searchKey,
                },
            };
        } else if (search.searchBy === 'transactionId' && search.searchKey) {
            searchObject['transaction'] = {
                id: {
                    contains: search.searchKey,
                },
            };
        } else if (search.searchBy === 'plan' && search.searchKey) {
            searchObject['subdomainPlan'] = {
                key: {
                    contains: search.searchKey,
                },
            };
        }

        const [total, data] = await Promise.all([
            this.prisma.invoice.count({
                where: {
                    ...searchObject,
                },
            }),
            this.prisma.invoice.findMany({
                where: {
                    ...searchObject,
                },
                include: {
                    subdomainPlan: {
                        select: {
                            key: true,
                        },
                    },
                    subdomain: {
                        select: {
                            name: true,
                        },
                    },
                    transaction: {
                        select: {
                            id: true,
                        },
                    },
                },

                ...pagination,
            }),
        ]);

        //to generate invoice number based on format 0001-022023
        data.forEach((d) =>
            Object.assign(
                d,
                d.numberInMonth
                    ? {
                        invoiceNumber: `${d.numberInMonth
                            .toString()
                            .padStart(
                                4,
                                '0'
                            )}-${d.createdAt.getMonth()}${d.createdAt.getFullYear()}`,
                    }
                    : {
                        invoiceNumber: null,
                    }
            )
        );

        return {
            total,
            data,
        };
    }

    async findOne(id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: {
                id: id,
            },
            include: {
                subdomainPlan: {
                    select: {
                        key: true,
                        subdomainBillings: true,
                    },
                },
                subdomain: {
                    select: {
                        expiredAt: true,
                        name: true,
                    },
                },
                transaction: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        return {
            ...invoice,
            invoiceNumber: invoice.numberInMonth
                ? {
                    invoiceNumber: `${invoice.numberInMonth
                        .toString()
                        .padStart(
                            4,
                            '0'
                        )}-${invoice.createdAt.getMonth()}${invoice.createdAt.getFullYear()}`,
                }
                : {
                    invoiceNumber: null,
                },
        };
    }

    update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
        return `This action updates a #${id} invoice`;
    }

    remove(id: number) {
        return `This action removes a #${id} invoice`;
    }
}
