import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFAQCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFAQCategoryDto } from './dto/update-faq-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';

@Injectable()
export class FAQCategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(subdomainId: string, data: CreateFAQCategoryDto) {
        return this.prisma.fAQCategory.create({
            data: {
                subdomain: {
                    connect: {
                        id: subdomainId 
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
        return this.prisma.fAQCategory.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                subdomainId, isDeleted 
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc' 
            },
        });
    }

    async findOne(subdomainId: string, id: string, withDeleted = false) {
        const category = await this.prisma.fAQCategory.findUnique({
            where: {
                id 
            } 
        });
        if (!category || category.subdomainId !== subdomainId || (withDeleted ? false : category.isDeleted))
            throw new NotFoundException('FAQ category not found!');
        return category;
    }

    async update(subdomainId: string, id: string, data: UpdateFAQCategoryDto) {
        await this.findOne(subdomainId, id);
        await this.prisma.fAQCategory.update({
            where: {
                id 
            }, data 
        });
        return true;
    }

    async restore(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id, true);
        await this.prisma.fAQCategory.update({
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
        await this.prisma.fAQCategory.update({
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
        await this.prisma.fAQCategory.delete({
            where: {
                id 
            },
        });
        return true;
    }
}
