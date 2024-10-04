import {ConflictException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { countries } from '../../config/initialization';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class CountryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {
        await this.prisma.country.createMany({
            skipDuplicates: true,
            data: countries,
        });
    }

    async create(data: CreateCountryDto) {
        const found = await this.prisma.country.findUnique({
            where: {
                code: data.code,
            },
        });
        if (found) throw new ConflictException('Country is already existed');
        return this.prisma.country.create({
            data
        });
    }

    async findAll() {
        return this.db.selectFrom('Country')
            .selectAll()
            .execute();
    }

    async findOne(code: string) {
        return this.db.selectFrom('Country')
            .where('code', '=', code)
            .selectAll()
            .executeTakeFirst();
    }

    async update(code: string, data: UpdateCountryDto) {
        const found = await this.findOne(code);
        if (!found) throw new NotFoundException();

        return this.prisma.country.update({
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

        return this.prisma.country.delete({
            where: {
                code,
            },
        });
    }
}
