import {ConflictException,
    Injectable,
    NotFoundException,
    OnModuleInit,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { levels } from 'src/config/initialization';
import { ConfigService } from '@nestjs/config';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class LevelsService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService, @InjectKysely() private db: Kysely<DB>) { }

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {
        await this.prisma.level.createMany({
            skipDuplicates: true,
            data: levels.map((name) => ({
                name 
            })),
        });
    }

    async create(userId: string, createLevelDto: CreateLevelDto) {
        const isExisted = await this.db
            .selectFrom('Level')
            .where('name', '=', createLevelDto.name)
            .selectAll()
            .executeTakeFirst();
        if (isExisted) throw new ConflictException();
        return this.prisma.level.create({
            data: {
                userId, ...createLevelDto 
            },
        });
    }

    async findAll() {
        return this.db
            .selectFrom('Level')
            .selectAll()
            .execute();
    }

    async findOne(id: number) {
        const level = await this.db
            .selectFrom('Level')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        if (!level) throw new NotFoundException();
        return level;
    }

    async update(id: number, updateLevelDto: UpdateLevelDto) {
        await this.findOne(id);
        return this.db
            .updateTable('Level')
            .where('id', '=', id)
            .set({
                ...updateLevelDto, updatedAt: new Date().toISOString() 
            })
            .returningAll()
            .executeTakeFirst();
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.db
            .updateTable('Level')
            .where('id', '=', id)
            .set({
                isDeleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() 
            })
            .returningAll()
            .executeTakeFirst();
    }
}
