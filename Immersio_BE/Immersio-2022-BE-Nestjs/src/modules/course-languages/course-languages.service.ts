import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { courseLanguages } from 'src/config/initialization';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseLanguageDto } from './dto/create-course-language.dto';
import { UpdateCourseLanguageDto } from './dto/update-course-language.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class CourseLanguagesService implements OnModuleInit {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectKysely() private db: Kysely<DB>
    ) {}

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {
        await this.prisma.courseLanguage.createMany({
            skipDuplicates: true,
            data: courseLanguages,
        });
    }
    async create(data: CreateCourseLanguageDto) {
        return this.prisma.courseLanguage.create({
            data,
        });
    }

    async findAll() {
        const res = await this.db
            .selectFrom('CourseLanguage')
            .where('CourseLanguage.isDeleted', '=', false)
            .selectAll()
            .execute();
        return res.sort((a, b) => a.name.localeCompare(b.name));
    }

    async findOne(id: number) {
        const courseLanguage = await this.prisma.courseLanguage.findUnique({
            where: {
                id,
            },
        });
        if (!courseLanguage || courseLanguage.isDeleted)
            throw new NotFoundException();
        return courseLanguage;
    }

    async update(id: number, data: UpdateCourseLanguageDto) {
        const courseLanguage = await this.prisma.courseLanguage.findUnique({
            where: {
                id,
            },
        });
        if (!courseLanguage) throw new NotFoundException();
        return this.prisma.courseLanguage.update({
            where: {
                id,
            },
            data,
        });
    }

    async remove(id: number) {
        const courseLanguage = await this.prisma.courseLanguage.findUnique({
            where: {
                id,
            },
        });
        if (!courseLanguage) throw new NotFoundException();
        return this.prisma.courseLanguage.update({
            data: {
                isDeleted: true,
            },
            where: {
                id,
            },
        });
    }

    async getLanguagesHasCourse(subdomainId: string, isFree = false) {
        const languages = await this.prisma.$queryRawUnsafe(
            `
            SELECT courseLanguage."name", courseLanguage."id", courseLanguage."code" 
            FROM "CourseLanguage" AS courseLanguage
            INNER JOIN "Course" AS course ON course."courseLanguageId" = courseLanguage."id" 
            WHERE course."subdomainId" = '${subdomainId}' ${
    isFree ? 'AND course."isFree" = true' : ''
} AND course."isPublished" = true AND course."isDeleted" = false
            GROUP BY courseLanguage."name", courseLanguage."id", courseLanguage."code" 
            ORDER BY courseLanguage."name"
        `
        );

        return languages;
    }
}
