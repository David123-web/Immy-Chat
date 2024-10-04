import {BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto, SearchParamsDto } from '../../common/dto';
import { PlanStatus, Role } from '@prisma/client';
import { AddTutoringMaterialDto } from './dto/add-tutoring-material.dto';
import { UpdateTutoringMaterialDto } from './dto/update-tutoring-material.dto';
import { CreateDrillDto } from '../drills/dto/create-drill.dto';
import { UpdateDrillDto } from '../drills/dto/update-drill.dto';
import { DrillDto } from '../drills/dto/drill.dto';

@Injectable()
export class PlanService {
    constructor(private readonly prisma: PrismaService) {}

    async foundUser(userId: string, role: Role) {
        return await this.prisma.user.findUnique({
            include: {
                profile: {
                    select: {
                        instructorId: role === Role.INSTRUCTOR,
                        tutorId: role === Role.TUTOR,
                        id: true,
                    },
                },
            },
            where: {
                id: userId,
            },
        });
    }

    async create(
        subdomainId: string,
        userId: string,
        role: Role,
        createPlanDto: CreatePlanDto
    ) {
        const foundUser = await this.foundUser(userId, role);

        return this.prisma.plan.create({
            data: {
                ...createPlanDto,
                classTags: {
                    connect: createPlanDto.classTags.map((id) => ({
                        id,
                    })),
                },
                subdomain: {
                    connect: {
                        id: subdomainId,
                    },
                },
                ownerInstructor:
                    role === Role.INSTRUCTOR
                        ? {
                            connect: {
                                id: foundUser.profile.instructorId,
                            },
                        }
                        : undefined,
                ownerTutor:
                    role === Role.TUTOR
                        ? {
                            connect: {
                                id: foundUser.profile.tutorId,
                            },
                        }
                        : undefined,
                language: {
                    connect: {
                        id: createPlanDto.language,
                    },
                },
                course: {
                    connect: {
                        id: createPlanDto.course,
                    },
                },
                students: {
                    connect: createPlanDto.students.map((id) => ({
                        id,
                    })),
                },
                tutors: {
                    connect: createPlanDto.tutors.map((id) => ({
                        id,
                    })),
                },
            },
        });
    }

    async findAll(
        subdomainId: string,
        userId: string,
        role: Role,
        {
            skip,
            take,
            cursorId,
            sortBy,
            sortDesc,
            isDeleted,
            searchBy,
            searchKey,
        }: SearchParamsDto
    ) {
        const foundUser = await this.foundUser(userId, role);
        if (!foundUser || foundUser.subdomainId !== subdomainId)
            throw new UnauthorizedException();

        const searchObject: any = {
        };

        if (searchBy && searchKey) {
            if (searchBy === 'title') {
                searchObject[searchBy] = {
                    contains: searchKey,
                };
            } else if (searchBy === 'status') {
                searchObject[searchBy] = {
                    equals: searchKey,
                };
            } else if (searchBy === 'tutors') {
                searchObject[searchBy] = {
                    every: {
                        profile: {
                            OR: {
                                lastName: {
                                    contains: searchKey,
                                },
                                firstName: {
                                    contains: searchKey,
                                },
                            },
                            user: {
                                subdomainId: subdomainId,
                            },
                        },
                    },
                };
            } else {
                throw new BadRequestException(
                    'searchBy must be title, status and tutors'
                );
            }
        }

        const total = await this.prisma.plan.count({
            where: {
                subdomainId,
                isDeleted,
                OR: [
                    {
                        tutors: {
                            some: {
                                id: foundUser.profile?.tutorId,
                            },
                        },
                    },
                    {
                        ownerTutor:
                            role === Role.TUTOR
                                ? {
                                    id: foundUser.profile?.tutorId,
                                }
                                : null,
                    },
                    {
                        ownerInstructor:
                            role === Role.INSTRUCTOR
                                ? {
                                    id: foundUser.profile?.instructorId,
                                }
                                : null,
                    },
                ],

                ...searchObject,
            },
        });

        const plans = await this.prisma.plan.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            include: {
                students: {
                    include: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                tutors: {
                    include: {
                        profile: {
                            select: {
                                lastName: true,
                                firstName: true,
                            },
                        },
                    },
                },
            },
            where: {
                subdomainId,
                isDeleted,
                OR: [
                    {
                        tutors: {
                            some: {
                                id: foundUser.profile?.tutorId,
                            },
                        },
                    },
                    {
                        ownerTutor:
                            role === Role.TUTOR
                                ? {
                                    id: foundUser.profile?.tutorId,
                                }
                                : null,
                    },
                    {
                        ownerInstructor:
                            role === Role.INSTRUCTOR
                                ? {
                                    id: foundUser.profile?.instructorId,
                                }
                                : null,
                    },
                ],

                ...searchObject,
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc',
            },
        });

        return {
            plans,
            total,
        };
    }

    async findOne(subdomainId: string, id: string) {
        const plan = await this.prisma.plan.findUnique({
            where: {
                id,
            },
            include: {
                tutors: true,
                students: true,
                tutoringMaterials: true,
                classTags: true,
                drills: {
                    include: {
                        data: true,
                        lesson: {
                            select: {
                                id: true,
                            },
                        },
                    },
                    where: {
                        lesson: {
                            isDeleted: false,
                        },
                    },
                },
                course: {
                    include: {
                        sections: {
                            include: {
                                lessons: {
                                    where: {
                                        isDeleted: false,
                                    },
                                },
                            },
                            where: {
                                isDeleted: false,
                            },
                        },
                    },
                },
            },
        });

        if (!plan || plan.subdomainId !== subdomainId || plan.isDeleted)
            throw new NotFoundException('Can found your plan');

        const _mappedDrills: Array<DrillDto> = plan.drills.map((d) => {
            const {
                id,
                instruction,
                sectionType,
                type,
                data,
                index,
                parentId,
                lessonId,
            } = d;
            const drill: DrillDto = {
                id,
                instruction,
                sectionType,
                index,
                parentId,
                data: data.map((e) => ({
                    id: e.id,
                    index: e.index,
                    question: e.data[0],
                    content: e.data.slice(1),
                    media: e.mediaId,
                    mediaUrl: e.mediaUrl,
                    correctIndex: e.correctIndex,
                })),
                type,
            };
            return {
                ...drill,
                lessonId,
            };
        });

        return {
            ...plan,
            drills: _mappedDrills,
        };
    }

    async update(id: string, updatePlanDto: UpdatePlanDto) {
        await this.prisma.plan.update({
            where: {
                id,
            },
            data: {
                ...updatePlanDto,
                classTags: {
                    set: updatePlanDto.classTags.map((id) => ({
                        id,
                    })),
                },
                language: {
                    connect: {
                        id: updatePlanDto.language,
                    },
                },
                course: {
                    connect: {
                        id: updatePlanDto.course,
                    },
                },
                students: {
                    set: updatePlanDto.students.map((id) => ({
                        id,
                    })),
                },
                tutors: {
                    set: updatePlanDto.tutors.map((id) => ({
                        id,
                    })),
                },
            },
        });
        return true;
    }

    async remove(id: string) {
        await this.prisma.plan.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        return true;
    }

    async addTutoringMaterial(
        planId: string,
        userId: string,
        role: Role,
        body: AddTutoringMaterialDto
    ) {
        const foundUser = await this.foundUser(userId, role);

        const plan = await this.prisma.plan.findUnique({
            where: {
                id: planId,
            },
            select: {
                tutors: true,
                ownerInstructor: true,
                ownerTutor: true,
                courseId: true,
            },
        });
        if (!plan) {
            throw new NotFoundException();
        }

        const tutorIds = plan.tutors.map((t) => t.id);

        if (
            !tutorIds.includes(foundUser.profile.tutorId) &&
            plan.ownerTutor?.id !== foundUser.profile.tutorId &&
            plan.ownerInstructor?.id !== foundUser.profile.instructorId
        ) {
            throw new UnauthorizedException();
        }

        const lesson = await this.prisma.lesson.findFirst({
            where: {
                section: {
                    courseId: plan.courseId,
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
                planId,
            },
        });
        return material;
    }

    async updateTutoringMaterial(
        id: string,
        userId: string,
        role: Role,
        body: UpdateTutoringMaterialDto
    ) {
        const foundUser = await this.foundUser(userId, role);

        const material = await this.prisma.tutoringMaterial.findFirst({
            where: {
                id,
                plan: {
                    OR: [
                        {
                            ownerTutor: {
                                id: foundUser.profile.tutorId,
                            },
                        },
                        {
                            tutors: {
                                some: {
                                    id: foundUser.profile.tutorId,
                                },
                            },
                        },
                    ],
                    ownerInstructor:
                        foundUser.role === Role.INSTRUCTOR
                            ? {
                                id: foundUser.profile.instructorId,
                            }
                            : null,
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
        const foundUser = await this.foundUser(userId, Role.TUTOR);

        const material = await this.prisma.tutoringMaterial.findFirst({
            where: {
                id,
                plan: {
                    OR: [
                        {
                            ownerTutor: {
                                id: foundUser.profile.tutorId,
                            },
                        },
                        {
                            tutors: {
                                some: {
                                    id: foundUser.profile.tutorId,
                                },
                            },
                        },
                    ],
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

    async addDrill(
        planId: string,
        userId: string,
        role: Role,
        body: CreateDrillDto
    ) {
        const foundUser = await this.foundUser(userId, role);

        const plan = await this.prisma.plan.findUnique({
            where: {
                id: planId,
            },
            select: {
                tutors: true,
                ownerTutor: true,
                ownerInstructor: true,
                courseId: true,
            },
        });
        if (!plan) {
            throw new NotFoundException();
        }

        const tutorIds = plan.tutors.map((t) => t.id);

        if (
            !tutorIds.includes(foundUser.profile.tutorId) &&
            plan.ownerTutor?.id !== foundUser.profile.tutorId &&
            plan.ownerInstructor?.id !== foundUser.profile.instructorId
        ) {
            throw new UnauthorizedException();
        }

        const lesson = await this.prisma.lesson.findFirst({
            where: {
                section: {
                    courseId: plan.courseId,
                },
                id: body.lessonId,
            },
        });
        if (!lesson) {
            throw new BadRequestException('Lesson does not exist!');
        }
        const {
            lessonId,
            instruction,
            sectionType,
            type,
            data: drillItems,
        } = body;
        const mappedDrillItems = drillItems.map((d) => {
            const { correctIndex, question, content, media, mediaUrl } = d;
            const result = {
                mediaId: media,
                mediaUrl,
                correctIndex,
                data: [question, ...content],
            };
            return result;
        });

        const _addedDrill = await this.prisma.drill.create({
            data: {
                instruction,
                sectionType,
                type,
                data: {
                    createMany: {
                        data: mappedDrillItems,
                    },
                },
                plan: {
                    connect: {
                        id: planId,
                    },
                },
                lesson: {
                    connect: {
                        id: lessonId,
                    },
                },
            },
            include: {
                data: true,
                lesson: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const _result: DrillDto = {
            id: _addedDrill.id,
            instruction: _addedDrill.instruction,
            sectionType: _addedDrill.sectionType,
            index: _addedDrill.index,
            parentId: _addedDrill.parentId,
            data: _addedDrill.data.map((d) => ({
                id: d.id,
                index: d.index,
                question: d.data[0],
                content: d.data.slice(1),
                media: d.mediaId,
                mediaUrl: d.mediaUrl,
                correctIndex: d.correctIndex,
            })),
            type,
        };

        return {
            ..._result,
            lessonId,
        };
    }

    async updateDrill(
        drillId: string,
        userId: string,
        role: Role,
        body: UpdateDrillDto
    ) {
        const foundUser = await this.foundUser(userId, role);

        const drill = await this.prisma.drill.findFirst({
            where: {
                id: drillId,
                plan: {
                    OR: [
                        {
                            ownerTutor: {
                                id: foundUser.profile.tutorId,
                            },
                        },
                        {
                            tutors: {
                                some: {
                                    id: foundUser.profile.tutorId,
                                },
                            },
                        },
                    ],
                    ownerInstructor:
                        role === Role.INSTRUCTOR
                            ? {
                                id: foundUser.profile.instructorId,
                            }
                            : null,
                },
            },
        });

        if (!drill) {
            throw new NotFoundException('Drill does not exist!');
        }

        const {
            instruction,
            sectionType,
            type,
            index,
            parentId,
            data: drillItems,
            lessonId,
        } = body;
        const mappedDrillItems = drillItems.map((d) => {
            const {
                id,
                correctIndex,
                question,
                content,
                media,
                mediaUrl,
                index: itemIndex,
            } = d;
            const result = {
                id,
                mediaId: media,
                mediaUrl,
                correctIndex,
                index: itemIndex,
                data: [question, ...content],
            };
            return result;
        });

        await this.prisma.drillItem.deleteMany({
            where: {
                drillId,
            },
        });

        await Promise.all(
            mappedDrillItems.map((d) => {
                return this.prisma.drillItem.create({
                    data: {
                        mediaId: d.mediaId,
                        mediaUrl: d.mediaUrl,
                        correctIndex: d.correctIndex,
                        index: d.index,
                        data: d.data,
                        drillId,
                    },
                });
            })
        );

        const _updatedDrill = await this.prisma.drill.update({
            where: {
                id: drillId,
            },
            data: {
                instruction,
                sectionType,
                index,
                type,
                parentId,
            },
            include: {
                data: true,
                lesson: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const _result: DrillDto = {
            id: _updatedDrill.id,
            instruction: _updatedDrill.instruction,
            sectionType: _updatedDrill.sectionType,
            index: _updatedDrill.index,
            parentId: _updatedDrill.parentId,
            data: _updatedDrill.data.map((d) => ({
                id: d.id,
                index: d.index,
                question: d.data[0],
                content: d.data.slice(1),
                media: d.mediaId,
                mediaUrl: d.mediaUrl,
                correctIndex: d.correctIndex,
            })),
            type,
        };

        return {
            ..._result,
            lessonId,
        };
    }

    async deleteDrill(id: string, userId: string) {
        const foundUser = await this.foundUser(userId, Role.TUTOR);

        const drill = await this.prisma.drill.findFirst({
            where: {
                id,
                plan: {
                    OR: [
                        {
                            ownerTutor: {
                                id: foundUser.profile.tutorId,
                            },
                        },
                        {
                            tutors: {
                                some: {
                                    id: foundUser.profile.tutorId,
                                },
                            },
                        },
                    ],
                    ownerInstructor:
                        foundUser.role === Role.INSTRUCTOR
                            ? {
                                id: foundUser.profile.instructorId,
                            }
                            : null,
                },
            },
        });

        if (!drill) {
            throw new NotFoundException('Drill does not exist!');
        }

        await this.prisma.drill.delete({
            where: {
                id,
            },
        });

        return true;
    }
}
