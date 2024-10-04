import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDialogLineAIDataDto } from './dto/create-dialog-line-ai.dto';
import { CreateDialogLineDto } from './dto/create-dialog-line.dto';
import FindDialogLinesDto from './dto/find-dialog-lines.dto';
import { UpdateDialogLineAIDataDto } from './dto/update-dialog-line-ai-data.dto';
import { UpdateDialogLineDto } from './dto/update-dialog-line.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { FindDialogsDto } from '../dialogs/dto/find-dialogs.dto';

@Injectable()
export class DialogLinesService {
    constructor(private readonly prisma: PrismaService, @InjectKysely() private db: Kysely<DB>) { }
    async create(data: CreateDialogLineDto) {
        return this.prisma.dialogLine.create({
            data: {
                ...data,
                medias: {
                    connect: data.medias.map((id) => ({
                        id 
                    })),
                },
            },
        });
    }

    async findAll({
        skip,
        take,
        cursorId,
        dialogId,
        sortBy,
        sortDesc,
    }: FindDialogLinesDto) {
        return this.prisma.dialogLine.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
            where: {
                dialogId 
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
        return this.prisma.dialogLine.findUnique({
            where: {
                id,
            },
            include: {
                medias: true
            },
        });
    }

    async findAllbyDialogId(id: number) {
        return this.prisma.dialogLine.findMany({
            where: {
                dialogId: id,
            },
        });
    }


    async findAlldialoglinesByLessonId(dto: FindDialogsDto){
        const {lessonId} = dto;
        const dialogs = await this.prisma.dialog.findMany({
            where: {
                lessonId: lessonId,
            },
        });
        if (!dialogs || dialogs.length === 0) throw new NotFoundException('Dialogs not found.');

        const dialogLinesPromises = dialogs.map(dialog => 
            this.prisma.dialogLine.findMany({
                where: {
                    dialogId: dialog.id
                },
                orderBy: "index"
                 ? {
                ["index"]: false ? 'desc' : 'asc',
                }
                :   {
                },
            })
        );
    
        const dialogLinesResults = await Promise.all(dialogLinesPromises);
        const allDialogLines = dialogLinesResults.flat();
    
        return allDialogLines;
    }


    async update(id: number, data: UpdateDialogLineDto) {
        const phrase = await this.prisma.dialogLine.findUnique({
            where: {
                id 
            } 
        });
        if (!phrase) throw new NotFoundException();
        return this.prisma.dialogLine.update({
            where: {
                id 
            },
            data: {
                ...data,
                medias: {
                    set: data.medias.map((id) => ({
                        id 
                    })),
                },
            },
        });
    }

    async remove(id: number) {
        const phrase = await this.prisma.dialogLine.findUnique({
            where: {
                id 
            } 
        });
        if (!phrase) throw new NotFoundException();
        return this.prisma.dialogLine.delete({
            where: {
                id 
            },
        });
    }

    async createAIData(subdomainId: string, dialogLineId: number, data: CreateDialogLineAIDataDto) {
        return this.prisma.dialogAIData.create({
            data: {
                subdomainId,
                dialogLineId,
                ...data,
            },
        });
    }

    async updateAIData(subdomainId: string, dialogLineId: number, data: UpdateDialogLineAIDataDto) {
        return this.prisma.dialogAIData.updateMany({
            where: {
                subdomainId,
                dialogLineId,
            },
            data: {
                ...data,
            },
        });
    }

    async findAllAIData(subdomainId: string, dialogLineId: number) {
        return this.db.selectFrom('DialogAIData')
            .where('subdomainId', '=', subdomainId)
            .where('dialogLineId', '=', dialogLineId)
            .selectAll()
            .execute();
    }
}
