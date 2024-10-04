import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFAQDto } from './dto/create-faq.dto';
import { UpdateFAQDto } from './dto/update-faq.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';
@Injectable()

export class FAQsService {
    constructor(private readonly prisma: PrismaService) { }
    async create(subdomainId: string, { categoryId, ...data }: CreateFAQDto) {
        return this.prisma.fAQ.create({
            data: {
                subdomain: {
                    connect: {
                        id: subdomainId 
                    } 
                },
                category: {
                    connect: {
                        id: categoryId 
                    } 
                },
                ...data,
            },
        });
    }

    async findAll(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc, isDeleted }: PaginationSortDto
    ) {
        return this.prisma.fAQ.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                subdomainId, isDeleted 
            },
            include: {
                category:{
                    select: {
                        name: true
                    }
                }
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc' 
            },

        });

    }

    async findOne(subdomainId: string, id: string, withDeleted = false) {
        const faq = await this.prisma.fAQ.findUnique({
            where: {
                id 
            }, include: {
                category: true 
            } 
        });
        if (!faq || faq.subdomainId !== subdomainId || (withDeleted ? false : faq.isDeleted))
            throw new NotFoundException('FAQ not found!');
        return faq;

    }

    async update(subdomainId: string, id: string, { categoryId, ...data }: UpdateFAQDto) {
        await this.findOne(subdomainId, id);
        await this.prisma.fAQ.update({
            where: {
                id 
            }, data: {
                ...data,
                category: {
                    connect: {
                        id: categoryId 
                    } 
                },
            }
        });
        return true;
    }

    async restore(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id, true);
        await this.prisma.fAQ.update({
            where: {
                id 
            },
            data: {
                isDeleted: false 
            },
        });
        return true;

    }

    async remove(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id);
        await this.prisma.fAQ.update({
            where: {
                id 
            },
            data: {
                isDeleted: true 
            },
        });

        return true;

    }

    async permanentRemove(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id);
        await this.prisma.fAQ.delete({
            where: {
                id 
            },
        });
        return true;
    }
}

