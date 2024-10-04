import {ConflictException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { proficiencyLevels } from '../../config/initialization';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProficiencyLevelDto } from './dto/create-proficiency-level.dto';
import { UpdateProficiencyLevelDto } from './dto/update-proficiency-level.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class ProficiencyLevelsService {
    constructor(private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {
        await this.prisma.proficiencyLevel.createMany({
            skipDuplicates: true,
            data: proficiencyLevels,
        });
    }

    async create(data: CreateProficiencyLevelDto) {
        const found = await this.prisma.proficiencyLevel.findUnique({
            where: {
                code: data.code,
            },
        });
        if (found)
            throw new ConflictException('Proficiency level is already existed');
        return this.prisma.proficiencyLevel.create({
            data 
        });
    }

    async findAll() {
        return this.db.selectFrom('ProficiencyLevel')
            .selectAll()
            .execute();
    }

    async findOne(code: string) {
        return this.prisma.proficiencyLevel.findUnique({
            where: {
                code,
            },
        });
    }

    async update(code: string, data: UpdateProficiencyLevelDto) {
        const found = await this.findOne(code);
        if (!found) throw new NotFoundException();

        return this.prisma.proficiencyLevel.update({
            data: {
                name: data.name,
            },
            where: {
                code,
            },
        });
    }

    async remove(code: string) {
        const found = await this.findOne(code);
        if (!found) throw new NotFoundException();

        return this.prisma.language.delete({
            where: {
                code,
            },
        });
    }
}
