import {ConflictException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { languages } from '../../config/initialization';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class LanguageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {
        await this.prisma.language.createMany({
            skipDuplicates: true,
            data: languages,
        });
    }

    async create(data: CreateLanguageDto) {
        const found = await this.prisma.language.findUnique({
            where: {
                code: data.code,
            },
        });
        if (found) throw new ConflictException('language is already existed');
        return this.prisma.language.create({
            data 
        });
    }

    async findAll() {
        return this.db.selectFrom('Language')
            .selectAll()
            .execute();
    }

    async findOne(code: string) {
        return this.db.selectFrom('Language')
            .where('code', '=', code)
            .selectAll()
            .executeTakeFirst();
    }

    async update(code: string, data: UpdateLanguageDto) {
        const found = await this.findOne(code);
        if (!found) throw new NotFoundException();

        return this.prisma.language.update({
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
