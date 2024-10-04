import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';

@Injectable()
export class BlogsService {
    constructor(private readonly prisma: PrismaService) { }
    async create(subdomainId: string, { fileIds, categoryId, ...data }: CreateBlogDto) {
        return this.prisma.blog.create({
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
                files: fileIds ? {
                    connect: fileIds.map(id => ({
                        id 
                    })) 
                } : undefined,
                ...data,
            },
        });
    }

    async findAll(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc, isDeleted }: PaginationSortDto
    ) {
        return this.prisma.blog.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                subdomainId, isDeleted 
            },
            include: {
                category: {
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

    async findAllPublic(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto
    ) {
        return this.prisma.blog.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                subdomainId, isDeleted: false, isPublished: true
            },
            include: {
                category: {
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
        const blog = await this.prisma.blog.findUnique({
            where: {
                id 
            }, include: {
                category: true, files: true 
            } 
        });
        if (!blog || blog.subdomainId !== subdomainId || (withDeleted ? false : blog.isDeleted))
            throw new NotFoundException('Blog not found!');
        return blog;
    }

    async update(subdomainId: string, id: string, { fileIds, categoryId, ...data }: UpdateBlogDto) {
        const blog = await this.findOne(subdomainId, id);
        await this.prisma.blog.update({
            where: {
                id 
            }, data: {
                category: {
                    connect: {
                        id: categoryId 
                    } 
                },
                files: fileIds ? {
                    connect: fileIds.filter(id => !blog.files.map(f => f.id).includes(id)).map(id => ({
                        id 
                    })),
                    disconnect: blog.files.map(f => f.id).filter(id => !fileIds.includes(id)).map(id => ({
                        id
                    }))
                } : undefined, ...data
            }
        });
        return true;
    }

    async restore(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id, true);
        await this.prisma.blog.update({
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
        await this.prisma.blog.update({
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
        await this.prisma.blog.delete({
            where: {
                id 
            },
        });
        return true;
    }
}