import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService, @InjectKysely() private db: Kysely<DB>) { }
    async create(userId: string, createSettingDto: CreateSettingDto) {
        const user = await this.db.selectFrom('User')
            .where('id', '=', userId)
            .selectAll()
            .executeTakeFirst();
        if (!user) throw new NotFoundException();
        await this.prisma.setting.create({
            data: {
                ...createSettingDto, subdomainId: user.subdomainId
            },
        });
        return true;
    }

    async findAll(subdomainId: string) {
        return this.db.selectFrom('Setting')
            .where('subdomainId', '=', subdomainId)
            .selectAll()
            .execute();
    }

    async findOne(id: number) {
        const setting = await this.db.selectFrom('Setting')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        if (!setting) throw new NotFoundException();
        return setting;
    }

    async update(userId: string, id: number, updateSettingDto: UpdateSettingDto) {
        const [setting, user] = await Promise.all([
            this.findOne(id),
            this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            }),
        ]);
        if (setting.subdomainId !== user.subdomainId)
            throw new ForbiddenException();
        return this.prisma.setting.update({
            where: {
                id
            },
            data: updateSettingDto,
        });
    }
}
