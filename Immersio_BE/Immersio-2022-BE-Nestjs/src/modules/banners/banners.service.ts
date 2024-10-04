import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';

@Injectable()
export class BannersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(subdomainId: string, { fileId, ...data }: CreateBannerDto) {
        return this.prisma.banner.create({
            data: {
                subdomain: {
                    connect: {
                        id: subdomainId 
                    } 
                },
                file: fileId ? {
                    connect: {
                        id: fileId 
                    } 
                } : undefined,
                ...data,
            },
        });
    }

    async findAll(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc, isDeleted }: PaginationSortDto
    ) {
        return this.prisma.banner.findMany({
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
        const banner = await this.prisma.banner.findUnique({
            where: {
                id 
            }, include: {
                file: true 
            } 
        });
        if (!banner || banner.subdomainId !== subdomainId || (withDeleted ? false : banner.isDeleted))
            throw new NotFoundException('Banner not found!');
        return banner;
    }

    async update(subdomainId: string, id: string, { fileId, ...data }: UpdateBannerDto) {
        await this.findOne(subdomainId, id);
        await this.prisma.banner.update({
            where: {
                id 
            }, data: {
                file: fileId ? {
                    connect: {
                        id: fileId 
                    } 
                } : undefined,
            }
        });
        return true;
    }

    async restore(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id, true);
        await this.prisma.banner.update({
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
        await this.prisma.banner.update({
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
        await this.prisma.banner.delete({
            where: {
                id 
            },
        });
        return true;
    }
}
