import {ForbiddenException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteCourseDto } from './dto/complete-course.dto';
import { FindCourseTrackingsDto } from './dto/find-course-tracking.dto';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from 'kysely/types';

@Injectable()
export class CourseTrackingService {
    constructor(private readonly prisma: PrismaService, @InjectKysely() private db: Kysely<DB>) { }
    async findByCourseAndLesson(
        userId: string,
        courseId: number,
        lessonId: number
    ) {
        return this.db.selectFrom('CourseTracking')
            .where('userId', '=', userId)
            .where('courseId', '=', courseId)
            .where('lessonId', '=', lessonId)
            .orderBy('createdAt', 'desc')
            .selectAll()
            .execute();
    }

    async findByCourse(userId: string, courseId: number) {
        return this.db.selectFrom('CourseTracking')
            .where('userId', '=', userId)
            .where('courseId', '=', courseId)
            .orderBy('createdAt', 'desc')
            .selectAll()
            .execute();
    }

    async complete(userId: string, dto: CompleteCourseDto) {
        const lesson = await this.prisma.lesson.findUnique({
            where: {
                id: dto.lessonId 
            },
            select: {
                id: true 
            },
        });
        if (!lesson) throw new NotFoundException('Lesson not found!');
        return this.prisma.courseTracking.upsert({
            where: {
                userId_lessonId_indexStep: {
                    userId,
                    lessonId: dto.lessonId,
                    indexStep: dto.indexStep,
                },
            },
            create: {
                userId,
                ...dto,
            },
            update: {
                userId,
                ...dto,
            },
        });
    }
}
