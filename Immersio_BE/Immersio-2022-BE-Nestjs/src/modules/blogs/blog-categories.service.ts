import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';

@Injectable()
export class BlogCategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(subdomainId: string, data: CreateBlogCategoryDto) {
        return this.prisma.blogCategory.create({
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
        return this.prisma.blogCategory.findMany({
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
        const category = await this.prisma.blogCategory.findUnique({
            where: {
                id 
            } 
        });
        if (!category || category.subdomainId !== subdomainId || (withDeleted ? false : category.isDeleted))
            throw new NotFoundException('Blog category not found!');
        return category;
    }

    async update(subdomainId: string, id: string, data: UpdateBlogCategoryDto) {
        await this.findOne(subdomainId, id);
        await this.prisma.blogCategory.update({
            where: {
                id 
            }, data 
        });
        return true;
    }

    async restore(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id, true);
        await this.prisma.blogCategory.update({
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
        await this.prisma.blogCategory.update({
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
        await this.prisma.blogCategory.delete({
            where: {
                id 
            },
        });
        return true;
    }
}
