import {Injectable,
    ConflictException,
    NotFoundException,} from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { tags } from 'src/config/initialization';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

@Injectable()
export class TagsService implements OnModuleInit {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {
        await this.prisma.tag.createMany({
            skipDuplicates: true,
            data: tags.map((name) => ({
                name,
            })),
        });
    }

    async create(subdomainId: string, userId: string, dto: CreateTagDto) {
        const isExisted = await this.db
            .selectFrom('Tag')
            .where('name', '=', dto.name)
            .where('subdomainId', '=', subdomainId)
            .executeTakeFirst();
        if (isExisted) throw new ConflictException();
        return this.prisma.tag.create({
            data: {
                subdomainId,
                userId,
                ...dto,
            },
        });
    }

    async findAll(subdomainId: string) {
        return this.db
            .selectFrom('Tag')
            .where('subdomainId', '=', subdomainId)
            .where('isDeleted', '=', false)
            .selectAll()
            .select(eb => [
                jsonObjectFrom(eb.selectFrom('_CourseToTag').whereRef('B', '=', 'Tag.id').select(eb => [
                    eb.fn.count('A').distinct().as('courses')
                ])).as('_count')
            ])
            .execute();
    }

    async findOne(subdomainId: string, id: number) {
        const tag = await this.prisma.tag.findUnique({
            where: {
                id,
                subdomainId,
            },
            include: {
                _count: {
                    select: {
                        courses: true,
                    },
                },
            },
        });
        if (!tag || tag.isDeleted) throw new NotFoundException();
        return tag;
    }

    async update(userId: string, id: number, data: UpdateTagDto) {
        await this._checkValid(id, userId);
        return this.prisma.tag.update({
            where: {
                id,
            },
            data,
        });
    }

    async remove(userId: string, id: number) {
        await this._checkValid(id, userId);
        return this.prisma.tag.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            },
        });
    }

    async _checkValid(id: number, userId: string) {
        const { tag, user } = await this.db
            .selectNoFrom((eb) => [
                jsonObjectFrom(
                    eb.selectFrom('Tag').where('id', '=', id).selectAll()
                ).as('tag'),
                jsonObjectFrom(
                    eb.selectFrom('User').where('id', '=', userId).selectAll()
                ).as('user'),
            ])
            .executeTakeFirst();

        if (
            !tag ||
            (user.role === 'SUBDOMAIN_ADMIN' &&
                tag.subdomainId !== user.subdomainId)
        )
            throw new NotFoundException();
    }
}
