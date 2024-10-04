import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreatePhraseDto from './dto/create-phrase.dto';
import { FindPhraseDto } from './dto/find-phrase.dto';
import UpdatePhraseDto from './dto/update-phrase.dto';

@Injectable()
export class PhrasesService {
    constructor(private readonly prisma: PrismaService) { }
    async create(data: CreatePhraseDto) {
        const { value, explanation, index } = data;
        return this.prisma.phrase.create({
            data: {
                value,
                explanation,
                index,
                lesson: {
                    connect: {
                        id: data.lessonId
                    }
                },
            }
        });
    }

    async findAll(dto: FindPhraseDto) {
        const { lessonId } = dto;
        return this.prisma.phrase.findMany({
            where: {
                lesson: {
                    id: lessonId, isDeleted: false 
                }
            },
            include: {
                medias: true
            }
        });
    }

    async findAllPublic(dto: FindPhraseDto) {
        const { lessonId } = dto;
        return this.prisma.phrase.findMany({
            where: {
                lesson: {
                    id: lessonId, isDeleted: false 
                }
            },
            include: {
                medias: true
            }
        });
    }

    async findOneById(id: string) {
        return this.prisma.phrase.findUnique({
            where: {
                id 
            },
        });
    }

    async update(id: string, data: UpdatePhraseDto) {
        const phrase = await this.prisma.phrase.findUnique({
            where: {
                id 
            } 
        });
        if (!phrase) throw new NotFoundException();
        const { value, explanation, index } = data;

        return this.prisma.phrase.update({
            where: {
                id 
            },
            data: {
                value,
                explanation,
                index,
                lesson: {
                    connect: {
                        id: data.lessonId
                    }
                },
                medias: {
                    set: data.medias.map((id) => ({
                        id 
                    })),
                },
            },
        });
    }

    async remove(id: string) {
        const phrase = await this.prisma.phrase.findUnique({
            where: {
                id 
            } 
        });
        if (!phrase) throw new NotFoundException();
        return this.prisma.phrase.delete({
            where: {
                id 
            },
        });
    }

    async findAllByLessonDto(dto: FindPhraseDto){
        const {lessonId} = dto;
        return this.prisma.phrase.findMany({
            where: {
                lessonId: lessonId,
            },
        });
    }
}
