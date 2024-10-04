import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDialogCharacterDto } from './dto/create-dialog-character.dto';
import FindDialogCharactersDto from './dto/find-dialog-characters.dto';
import { UpdateDialogCharacterDto } from './dto/update-dialog-character.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class DialogCharactersService {

    // async onModuleInit() {
    //     const lessons = await this.db.selectFrom("Lesson").selectAll().execute();
    //     lessons.forEach(async (lesson) => {
    //         const dialogs = await this.db.selectFrom("Dialog").where("lessonId", "=", lesson.id).selectAll().execute();
    //         dialogs.forEach(async (dialog) => {
    //             const lines = await this.db.selectFrom("DialogLine").where("dialogId", "=", dialog.id).selectAll().execute();
    //             lines.forEach(async (line) => {
    //                 const char = await this.db.updateTable("DialogCharacter").where("id", "=", line.characterId).where("subdomainId", "is", null).set({ subdomainId: lesson.subdomainId }).returning("id").executeTakeFirst();
    //                 if(char) console.log("CharId updated:", char.id);
    //             })
    //         })
    //     })
    // }

    constructor(private readonly prisma: PrismaService, @InjectKysely() private db: Kysely<DB>) { }
    async create(subdomainId: string, data: CreateDialogCharacterDto) {
        return this.prisma.dialogCharacter.create({
            data: {
                ...data,
                subdomainId
            },
        });
    }

    async findAll(subdomainId: string, {
        skip,
        take,
        cursorId,
        sortBy,
        sortDesc,
    }: FindDialogCharactersDto) {
        return this.prisma.dialogCharacter.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                subdomainId 
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
    }

    async findOne(subdomainId: string, id: number) {
        const char = await this.db
            .selectFrom('DialogCharacter')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        if (char.subdomainId !== subdomainId) throw new NotFoundException('Dialog character not found!');
        return char;
    }

    async update(subdomainId: string, userId: string, id: number, data: UpdateDialogCharacterDto) {
        await this.findOne(subdomainId, id);
        return this.prisma.dialogCharacter.update({
            where: {
                id 
            },
            data,
        });
    }

    async remove(subdomainId: string, userId: string, id: number) {
        await this.findOne(subdomainId, id);
        return this.prisma.dialogCharacter.delete({
            where: {
                id 
            },
        });
    }
}
