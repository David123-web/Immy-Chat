import {BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { SearchParamsDto } from 'src/common/dto';
import { PrismaService } from '../prisma/prisma.service';
import { AddTutoringMaterialDto } from './dto/add-tutoring-material.dto';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { UpdateTutoringMaterialDto } from './dto/update-tutoring-material.dto';
import { UpdateTutoringDto } from './dto/update-tutoring.dto';

@Injectable()
export class TutoringService {
    constructor(private readonly prisma: PrismaService) { }

    async getTutoringPlans(
        userId: string,
        filter: SearchParamsDto,
        role: Role
    ) {
        const searchObject: any = {
        };

        if (role === Role.TUTOR) {
            const currentTutor = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    profile: {
                        select: {
                            tutorId: true,
                        },
                    },
                },
            });
            const tutorId = currentTutor.profile.tutorId;

            const whereClause = {
                tutorId,
                isEnabled: true,
            };

            const total = await this.prisma.tutoringPlan.count({
                where: whereClause,
            });

            const plans = await this.prisma.tutoringPlan.findMany({
                where: whereClause,
                select: {
                    id: true,
                    isEnabled: true,
                    isShared: true,
                    tutor: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                    course: {
                        select: {
                            id: true,
                            courseLanguageId: true,
                            language: true,
                            title: true,
                            instructor: {
                                select: {
                                    id: true,
                                    profile: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                },
                            },
                            level: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            sections: {
                                select: {
                                    _count: {
                                        select: {
                                            lessons: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                skip: filter.skip,
                take: filter.take,
                orderBy: {
                    id: 'desc',
                },
            });

            return {
                total,
                plans,
            };
        } else {
            const whereClause = {
                course: {
                    userId,
                },
                isEnabled: true,
            };

            const total = await this.prisma.tutoringPlan.count({
                where: whereClause,
            });

            const plans = await this.prisma.tutoringPlan.findMany({
                where: whereClause,
                select: {
                    id: true,
                    isEnabled: true,
                    isShared: true,
                    tutor: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                    course: {
                        select: {
                            id: true,
                            courseLanguageId: true,
                            language: true,
                            title: true,
                            instructor: {
                                select: {
                                    id: true,
                                    profile: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                },
                            },
                            level: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            sections: {
                                select: {
                                    _count: {
                                        select: {
                                            lessons: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                skip: filter.skip,
                take: filter.take,
                orderBy: {
                    id: 'desc',
                },
            });

            return {
                total,
                plans,
            };
        }
    }

    async updateSharePlan(id: string, userId: string, isShared: boolean) {
        const tutoringPlan = await this.prisma.tutoringPlan.findFirst({
            where: {
                id,
            },
            select: {
                tutor: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tutoringPlan) {
            throw new NotFoundException();
        }

        if (userId !== tutoringPlan.tutor.profile.userId) {
            throw new UnauthorizedException();
        }

        const result = await this.prisma.tutoringPlan.update({
            where: {
                id,
            },
            data: {
                isShared,
            },
        });

        return result;
    }

    async getTutoringPlanById(id: string, userId: string, role: Role) {
        const tutoringPlan = await this.prisma.tutoringPlan.findFirst({
            where: {
                id,
                isEnabled: true,
                course: {
                    isDeleted: false,
                },
            },
            select: {
                id: true,
                course: {
                    select: {
                        id: true,
                        title: true,
                        instructor: {
                            select: {
                                profile: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        userId: true,
                                    },
                                },
                            },
                        },
                        tutors: true,
                        sections: {
                            where: {
                                isDeleted: false,
                            },
                            select: {
                                title: true,
                                index: true,
                                id: true,
                                lessons: {
                                    where: {
                                        isDeleted: false,
                                    },
                                    select: {
                                        title: true,
                                        id: true,
                                        tutoringMaterials: true,
                                        // drills: {
                                        //     where: {
                                        //         tutoringPlanId: {
                                        //             not: null
                                        //         }
                                        //     }
                                        // }
                                    },
                                },
                            },
                        },
                    },
                },
                isShared: true,
                tutor: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tutoringPlan) {
            throw new NotFoundException();
        }

        if (
            role === Role.TUTOR &&
            userId !== tutoringPlan.tutor.profile.userId
        ) {
            throw new UnauthorizedException();
        }

        if (
            role === Role.INSTRUCTOR &&
            userId !== tutoringPlan.course.instructor.profile.userId
        ) {
            throw new UnauthorizedException();
        }

        return tutoringPlan;
    }

    async addTutoringMaterial(
        planId: string,
        userId: string,
        body: AddTutoringMaterialDto
    ) {
        const tutoringPlan = await this.prisma.tutoringPlan.findUnique({
            where: {
                id: planId,
            },
            select: {
                tutor: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
                courseId: true,
            },
        });

        if (!tutoringPlan) {
            throw new NotFoundException();
        }

        if (userId !== tutoringPlan.tutor.profile.userId) {
            throw new UnauthorizedException();
        }

        const lesson = await this.prisma.lesson.findFirst({
            where: {
                section: {
                    courseId: tutoringPlan.courseId,
                },
                id: body.lessonId,
            },
        });

        if (!lesson) {
            throw new BadRequestException('Lesson does not exist!');
        }

        const material = await this.prisma.tutoringMaterial.create({
            data: {
                ...body,
                // tutoringPlanId: planId,
            },
        });

        return material;
    }

    async updateTutoringMaterial(
        id: string,
        userId: string,
        body: UpdateTutoringMaterialDto
    ) {
        const material = await this.prisma.tutoringMaterial.findFirst({
            where: {
                id,
                plan: {
                    // tutor: {
                    //     profile: {
                    //         userId,
                    //     },
                    // },
                },
            },
        });

        if (!material) {
            throw new NotFoundException('Material does not exist!');
        }

        const result = await this.prisma.tutoringMaterial.update({
            where: {
                id,
            },
            data: {
                ...body,
            },
        });

        return result;
    }

    async deleteTutoringMaterial(id: string, userId: string) {
        const material = await this.prisma.tutoringMaterial.findFirst({
            where: {
                id,
                plan: {
                    // tutor: {
                    //     profile: {
                    //         userId,
                    //     },
                    // },
                },
            },
        });

        if (!material) {
            throw new NotFoundException('Material does not exist!');
        }

        await this.prisma.tutoringMaterial.delete({
            where: {
                id,
            },
        });

        return true;
    }
}
