import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDrillDto } from './dto/create-drill.dto';
import { DrillDto } from './dto/drill.dto';
import { FindDrillDto } from './dto/find-drill.dto';
import { UpdateDrillDto } from './dto/update-drill.dto';
import { SectionType } from '@prisma/client';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

@Injectable()
export class DrillsService {
    constructor(
        private readonly prisma: PrismaService,
        @InjectKysely() private db: Kysely<DB>
    ) {}

    async create(createDrillDto: CreateDrillDto) {
        const {
            lessonId,
            instruction,
            sectionType,
            type,
            parentId,
            data: drillItems,
        } = createDrillDto;
        if (!parentId)
            throw new BadRequestException(
                'This drill is not belong to any lessons'
            );

        const mappedDrillItems = drillItems.map((d) => {
            const { correctIndex, question, content, media } = d;
            const result = {
                mediaId: media,
                correctIndex,
                data: [question, ...content],
            };
            return result;
        });
        await this.prisma.drill.create({
            data: {
                instruction,
                sectionType,
                type,
                parentId: parentId,
                data: {
                    createMany: {
                        data: mappedDrillItems,
                    },
                },
                lesson: {
                    connect: {
                        id: lessonId,
                    },
                },
            },
        });

        return HttpStatus.CREATED;
    }

    async findAll({
        skip,
        take,
        cursorId,
        sortBy,
        sortDesc,
        lessonId,
        sectionType,
    }: FindDrillDto) {
        const drills = await this.prisma.drill.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                sectionType: {
                    equals: sectionType,
                    not: SectionType.TUTOR_PLAN,
                },
                lesson: {
                    id: lessonId,
                    isDeleted: false,
                },
            },
            include: {
                data: true,
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc',
            },
        });

        const _result: Array<DrillDto> = drills.map((d) => {
            const { id, instruction, sectionType, type, data, index } = d;
            const drill: DrillDto = {
                id,
                instruction,
                sectionType,
                index,
                parentId: d.parentId,
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
            return drill;
        });

        return _result;
    }

    async findAllPublic({
        skip,
        take,
        cursorId,
        sortBy,
        sortDesc,
        lessonId,
        sectionType,
    }: FindDrillDto) {
        const drills = await this.prisma.drill.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                sectionType: {
                    equals: sectionType,
                    not: SectionType.TUTOR_PLAN,
                },
                lesson: {
                    id: lessonId,
                    isDeleted: false,
                },
            },
            include: {
                data: true,
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc',
            },
        });

        const _result: Array<DrillDto> = drills.map((d) => {
            const { id, instruction, sectionType, type, data, index } = d;
            const drill: DrillDto = {
                id,
                instruction,
                sectionType,
                index,
                parentId: d.parentId,
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
            return drill;
        });

        return _result;
    }

    async findOne(id: string) {
        const drill = await this.db
            .selectFrom('Drill')
            .where('id', '=', id)
            .selectAll()
            .select((eb) => [
                jsonArrayFrom(
                    eb
                        .selectFrom('DrillItem')
                        .whereRef('drillId', '=', 'Drill.id')
                        .selectAll()
                ).as('data'),
            ])
            .executeTakeFirst();
        const _result: DrillDto = {
            ...drill,
            data: drill.data.map((e) => ({
                id: e.id,
                index: e.index,
                question: e.data[0],
                content: e.data.slice(1),
                media: e.mediaId,
                mediaUrl: e.mediaUrl,
                correctIndex: e.correctIndex,
            })),
        };

        return _result;
    }

    async update(id: string, updateDrillDto: UpdateDrillDto) {
        const {
            instruction,
            sectionType,
            type,
            parentId,
            index,
            data: drillItems,
        } = updateDrillDto;
        if (!parentId)
            throw new BadRequestException(
                'This drill is not belong to any lessons'
            );

        const mappedDrillItems = drillItems.map((d) => {
            const {
                id,
                correctIndex,
                question,
                content,
                media,
                index: itemIndex,
            } = d;
            const result = {
                id,
                mediaId: media,
                correctIndex,
                index: itemIndex,
                data: [question, ...content],
            };
            return result;
        });
        const mappedIds = drillItems.map((d) => d.id ?? '');

        await this.prisma.drillItem.deleteMany({
            where: {
                AND: {
                    drillId: id,
                    NOT: {
                        id: {
                            in: mappedIds,
                        },
                    },
                },
            },
        });

        await Promise.all(
            mappedDrillItems.map((d) => {
                return this.prisma.drillItem.upsert({
                    where: {
                        id: d?.id || '',
                    },
                    create: {
                        mediaId: d.mediaId,
                        correctIndex: d.correctIndex,
                        index: d.index,
                        data: d.data,
                        drillId: id,
                    },
                    update: {
                        mediaId: d.mediaId,
                        correctIndex: d.correctIndex,
                        index: d.index,
                        data: d.data,
                    },
                });
            })
        );

        await this.prisma.drill.update({
            where: {
                id,
            },
            data: {
                instruction,
                sectionType,
                index,
                type,
                parentId: parentId,
            },
        });

        return HttpStatus.OK;
    }

    async remove(id: string) {
        await this.prisma.drill.delete({
            where: {
                id,
            },
        });

        return HttpStatus.OK;
    }
}
