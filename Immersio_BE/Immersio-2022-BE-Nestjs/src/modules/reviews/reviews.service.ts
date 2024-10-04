import {ForbiddenException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';
import { Role } from '@prisma/client';

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) {}
    async create(userId: string, { tutorId, ...data }: CreateReviewDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            },
            include: {
                profile: {
                    select: {
                        student: true 
                    } 
                } 
            },
        });
        if (!user?.profile?.student)
            throw new NotFoundException('Student not found!');
        const tutor = await this.prisma.tutor.findUnique({
            where: {
                id: tutorId 
            },
        });
        if (!tutor) throw new NotFoundException('Tutor not found!');
        return this.prisma.review.create({
            data: {
                student: {
                    connect: {
                        id: user.profile.student.id 
                    } 
                },
                tutor: {
                    connect: {
                        id: tutorId 
                    } 
                },
                ...data,
            },
        });
    }

    async findAll(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto
    ) {
        const [data, total] = await Promise.all([
            this.prisma.review.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId 
                },
                where: {
                    student: {
                        profile: {
                            user: {
                                subdomainId 
                            } 
                        } 
                    },
                    isDeleted: false,
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc ? 'desc' : 'asc' 
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    firstName: true, lastName: true 
                                } 
                            },
                        },
                    },
                    tutor: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    firstName: true, lastName: true 
                                } 
                            },
                        },
                    },
                },
            }),
            this.prisma.review.count({
                where: {
                    student: {
                        profile: {
                            user: {
                                subdomainId 
                            } 
                        } 
                    },
                    isDeleted: false,
                },
            }),
        ]);

        return {
            total,
            data,
        };
    }

    async findOne(id: string) {
        const review = await this.prisma.review.findUnique({
            where: {
                id 
            },
            include: {
                student: {
                    select: {
                        profile: {
                            select: {
                                firstName: true, lastName: true 
                            } 
                        } 
                    },
                },
                tutor: {
                    select: {
                        profile: {
                            select: {
                                firstName: true, lastName: true 
                            } 
                        } 
                    },
                },
            },
        });
        if (review.isDeleted) throw new NotFoundException();
        return review;
    }

    async restore(subdomainId: string, userId: string, id: string) {
        await this._checkUserPermission(subdomainId, userId);
        return this.prisma.review.update({
            where: {
                id 
            },
            data: {
                isDeleted: false 
            },
        });
    }

    async remove(subdomainId: string, userId: string, id: string) {
        await this._checkUserPermission(subdomainId, userId);
        return this.prisma.review.update({
            where: {
                id 
            },
            data: {
                isDeleted: true 
            },
        });
    }

    async permanentRemove(subdomainId: string, userId: string, id: string) {
        await this._checkUserPermission(subdomainId, userId);
        return this.prisma.review.delete({
            where: {
                id 
            },
        });
    }

    private async _checkUserPermission(subdomainId: string, userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            },
            select: {
                subdomainId: true, role: true 
            },
        });
        if (
            !(
                user.role === Role.SUPER_ADMIN ||
        (user.role === Role.SUBDOMAIN_ADMIN && user.subdomainId === subdomainId)
            )
        )
            throw new ForbiddenException();
    }
}
