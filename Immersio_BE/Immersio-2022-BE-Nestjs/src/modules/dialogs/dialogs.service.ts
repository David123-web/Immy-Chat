import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { FindDialogsDto } from './dto/find-dialogs.dto';

@Injectable()
export class DialogsService {
    constructor(private readonly prisma: PrismaService) {}
    async create({ medias, lines, ...data }: CreateDialogDto) {
        return this.prisma.dialog.create({
            data: {
                ...data,
                lines: {
                    createMany: {
                        data: lines,
                    },
                },
                medias: {
                    connect: medias.map((id: string) => ({
                        id,
                    })),
                },
            },
        });
    }

    async findOneById(id: number) {
        return this.prisma.dialog.findUnique({
            where: {
                id,
            },
        });
    }

    async findAllByLessondto(dto: FindDialogsDto){
        const {lessonId} = dto;
        return this.prisma.dialog.findMany({
            where: {
                lessonId: lessonId,
            },
        });
    }

    async update(id: number, { medias, lines, ...data }: UpdateDialogDto) {
        const phrase = await this.prisma.dialog.findUnique({
            where: {
                id,
            },
        });
        if (!phrase) throw new NotFoundException();
        return this.prisma.dialog.update({
            where: {
                id,
            },
            data: {
                ...data,
                lines: {
                    createMany: {
                        data: lines,
                    },
                },
                medias: {
                    connect: medias.map((id: string) => ({
                        id,
                    })),
                },
            },
        });
    }

    async remove(id: number) {
        const phrase = await this.prisma.dialog.findUnique({
            where: {
                id,
            },
        });
        if (!phrase) throw new NotFoundException();
        return this.prisma.dialog.delete({
            where: {
                id,
            },
        });
    }
}
