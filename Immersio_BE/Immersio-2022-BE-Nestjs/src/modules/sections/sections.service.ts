import { Injectable, NotFoundException } from '@nestjs/common';
import { searchWithKeys } from 'src/utils/object';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import FindSectionDto from './dto/find-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class SectionsService {
    constructor(private readonly prisma: PrismaService, @InjectKysely() private db: Kysely<DB>) { }
    async create(userId: string, data: CreateSectionDto) {
        return this.prisma.courseSection.create({
            data: {
                ...data, userId 
            },
        });
    }

    async findAll({
        skip,
        take,
        cursorId,
        courseId,
        name: contains,
        sortBy,
        sortDesc,
    }: FindSectionDto) {
        return this.prisma.courseSection.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                courseId,
                isDeleted: false,
                OR: contains && searchWithKeys(['title'], contains, 'insensitive'),
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
    }

    async findOne(id: number) {
        const section = await this.db.selectFrom('CourseSection')
            .where('id', '=', id)
            .where('isDeleted', '=', false)
            .selectAll()
            .executeTakeFirst();
        if (!section) throw new NotFoundException();
        return section;
    }

    async update(id: number, data: UpdateSectionDto) {
        const section = await this.db.selectFrom('CourseSection')
            .where('id', '=', id)
            .executeTakeFirst();
        if (!section) throw new NotFoundException();
        return this.prisma.courseSection.update({
            where: {
                id 
            }, data 
        });
    }

    async remove(id: number) {
        const section = await this.db.selectFrom('CourseSection')
            .where('id', '=', id)
            .executeTakeFirst();
        if (!section) throw new NotFoundException();
        return this.prisma.courseSection.update({
            where: {
                id 
            },
            data: {
                isDeleted: true, deletedAt: new Date() 
            },
        });
    }
}
