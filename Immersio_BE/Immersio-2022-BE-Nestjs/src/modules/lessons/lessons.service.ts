import {ForbiddenException,
    Injectable,
    NotFoundException,
    Inject,
    forwardRef,} from '@nestjs/common';
import {BadRequestException,
    ConflictException,} from '@nestjs/common/exceptions';
import { searchWithKeys } from 'src/utils/object';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import FindLessonDto from './dto/find-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CoursesService } from '../courses/courses.service';
import CheckLessonProgressDto from './dto/check-lesson-progress';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class LessonsService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => CoursesService))
        private readonly coursesService: CoursesService,
        @InjectKysely() private db: Kysely<DB>
    ) {}
    async create(subdomainId: string, userId: string, data: CreateLessonDto) {
        return this.prisma.lesson.create({
            data: {
                ...data,
                userId,
                subdomainId,
            },
        });
    }

    async findAll(
        subdomainId: string,
        {
            skip,
            take,
            cursorId,
            name: contains,
            courseSectionId,
            sortBy,
            sortDesc,
        }: FindLessonDto
    ) {
        console.log(courseSectionId);
        return this.prisma.lesson.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                isDeleted: false,
                courseSectionId,
                subdomainId,
                OR:
                    contains &&
                    searchWithKeys(['title'], contains, 'insensitive'),
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
    }

    async findOne(userId: string, id: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: {
                id,
            },
            include: {
                section: {
                    select: {
                        courseId: true,
                    },
                },
                dialogs: {
                    include: {
                        lines: {
                            include: {
                                character: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                medias: true,
                            },
                        },
                    },
                },
                thumbnail: true,
                instructionVideo: true,
            },
        });
        const valid = await this.coursesService.checkPermission(
            userId,
            lesson.section.courseId
        );
        if (!valid?.result) throw new ForbiddenException();
        if (!lesson || lesson.isDeleted) throw new NotFoundException();

        const sortedDialogs = lesson.dialogs.sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
        const finalRes = {
            ...lesson,
            dialogs: sortedDialogs,
        };
        return finalRes;
    }

    async update(id: number, data: UpdateLessonDto) {
        const lesson = await this.db
            .selectFrom('Lesson')
            .where('id', '=', id)
            .executeTakeFirst();
        if (!lesson) throw new NotFoundException();
        return this.prisma.lesson.update({
            where: {
                id,
            },
            data,
        });
    }

    async remove(id: number) {
        const phrases = this.db
            .selectFrom('Phrase')
            .where('lessonId', '=', id)
            .select('id')
            .executeTakeFirst();
        const vocabularies = this.db
            .selectFrom('Vocabulary')
            .where('lessonId', '=', id)
            .select('id')
            .executeTakeFirst();
        const grammaries = this.db
            .selectFrom('Grammar')
            .where('lessonId', '=', id)
            .select('id')
            .executeTakeFirst();
        const dialogs = this.db
            .selectFrom('Dialog')
            .where('lessonId', '=', id)
            .select('id')
            .executeTakeFirst();
        const drills = this.db
            .selectFrom('Drill')
            .where('lessonId', '=', id)
            .select('id')
            .executeTakeFirst();

        const promises = await Promise.all([
            phrases,
            vocabularies,
            grammaries,
            dialogs,
            drills,
        ]);

        if (
            promises[0] ||
            promises[1] ||
            promises[2] ||
            promises[3] ||
            promises[4]
        )
            throw new ConflictException('Lesson can not be deleted!');

        const lesson = await this.db
            .selectFrom('Lesson')
            .where('id', '=', id)
            .select('isDeleted')
            .executeTakeFirst();
        if (!lesson) throw new NotFoundException();
        if (lesson.isDeleted)
            throw new ConflictException('Lesson is already deleted!');

        return this.prisma.lesson.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });
    }

    async resetProgress(subdomainId: string, userId: string, lessonId: number) {
        const profile = await this.db
            .selectFrom('Profile')
            .where('userId', '=', userId)
            .selectAll()
            .select((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Student')
                        .whereRef('id', '=', 'Profile.studentId')
                ).as('student'),
            ])
            .executeTakeFirst();
        await this.db
            .deleteFrom('LessonProgress')
            .where('lessonId', '=', lessonId)
            .where('studentId', '=', profile.studentId)
            .execute();
        return true;
    }

    async checkProgress(
        subdomainId: string,
        userId: string,
        data: CheckLessonProgressDto
    ) {
        const drill = await this.db
            .selectFrom('Drill')
            .where('id', '=', data.drillId)
            .selectAll()
            .executeTakeFirst();
        if (!drill) throw new NotFoundException('Drill not found!');

        const { drills, profile, isExisted } = await this.db
            .selectNoFrom((eb) => [
                jsonArrayFrom(
                    eb
                        .selectFrom('Drill')
                        .where('lessonId', '=', drill.lessonId)
                        .select((eb) => [
                            'id',
                            'index',
                            'type',
                            jsonArrayFrom(
                                eb
                                    .selectFrom('DrillItem')
                                    .whereRef('drillId', '=', 'Drill.id')
                            ).as('data'),
                        ])
                ).as('drills'),
                jsonObjectFrom(
                    eb
                        .selectFrom('Profile')
                        .where('userId', '=', userId)
                        .selectAll()
                        .select((eb) => [
                            jsonObjectFrom(
                                eb
                                    .selectFrom('Student')
                                    .select((xb) => [
                                        'totalDiamond',
                                        jsonArrayFrom(
                                            xb
                                                .selectFrom('LessonProgress')
                                                .where(
                                                    'lessonId',
                                                    '=',
                                                    drill.lessonId
                                                )
                                                .whereRef(
                                                    'studentId',
                                                    '=',
                                                    'Profile.studentId'
                                                )
                                                .selectAll()
                                                .orderBy('createdAt', 'desc')
                                        ).as('logs'),
                                    ])
                                    .whereRef('id', '=', 'Profile.studentId')
                            ).as('student'),
                        ])
                ).as('profile'),
                jsonObjectFrom(
                    eb
                        .selectFrom('LessonProgress')
                        .where('lessonId', '=', drill.lessonId)
                        .where('index', '=', data.index || 0)
                        .where('drillId', '=', drill.id)
                        .selectAll()
                ).as('isExisted'),
            ])
            .executeTakeFirst();
        let totalQuestion = 0;
        drills.map((d) => {
            switch (d.type) {
            case 'DRAG_THE_WORDS':
            case 'FLASH_CARD':
            case 'LISTEN_AND_FILL_BLANKS':
            case 'SORT_THE_PARAGRAPH':
            case 'MULTIPLE_CHOICES': {
                return (totalQuestion += d.data.length);
            }
            case 'DRAG_AND_DROP': {
                return (totalQuestion += 1);
            }
            }
        });

        if (totalQuestion <= profile?.student?.logs?.length) return false;

        if (isExisted && isExisted.studentId === profile?.studentId)
            throw new BadRequestException('Question is already did!');

        const lastCheckPoint = profile?.student?.logs?.length
            ? profile?.student?.logs[0]
            : null;
        if (
            drill &&
            profile &&
            !lastCheckPoint &&
            !(data.currentDiamond === 0 && data.currentHealth === 100)
        ) {
            await this.db
                .deleteFrom('LessonProgress')
                .where('lessonId', '=', drill.lessonId)
                .where('studentId', '=', profile.studentId)
                .executeTakeFirst();
            throw new BadRequestException('Incorrect diamond & health!');
        }

        let currentDiamond =
            lastCheckPoint?.currentDiamond || data.currentDiamond || 0;
        let currentHealth =
            lastCheckPoint?.currentHealth || data.currentHealth || 100;
        //TODO: Calculate diamond and health
        if (data.isCorrect) {
            currentDiamond += 10;
        } else {
            currentHealth -= Math.ceil(100 / (totalQuestion || 1));
        }

        if (!profile?.studentId)
            return {
                currentDiamond,
                currentHealth,
                drillId: data.drillId,
                index: data.index,
                lessonId: drill.lessonId,
                isCorrect: data.isCorrect,
            };

        const newCheckPoint = await this.db
            .insertInto('LessonProgress')
            .values({
                id: createId(),
                createdAt: new Date(),
                updatedAt: new Date(),
                currentDiamond,
                currentHealth,
                index: data.index || 0,
                drillId: data.drillId,
                lessonId: drill.lessonId,
                isCorrect: data.isCorrect,
                studentId: profile.studentId,
            })
            .returningAll()
            .executeTakeFirst();
        if (drills.length + 1 === totalQuestion) {
            await this.resetProgress(subdomainId, userId, drill.lessonId);
            if (currentHealth > 70)
                await this.db
                    .updateTable('Student')
                    .where('id', '=', profile.id)
                    .set({
                        totalDiamond: profile.student.totalDiamond,
                    })
                    .executeTakeFirst();
            return true;
        }
        return newCheckPoint;
    }
}
