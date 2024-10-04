import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateVocabularyDto from './dto/create-vocabulary.dto';
import { FindVocabularyDto } from './dto/find-vocabulary.dto';
import UpdateVocabularyDto from './dto/update-vocabulary.dto';

@Injectable()
export class VocabulariesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVocabularyDto) {
        const { value, explanation, index } = data;
        return this.prisma.vocabulary.create({
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
                    connect: data.medias.map((id) => ({
                        id 
                    })),
                },
            },
        });
    }

    async findAll(dto: FindVocabularyDto) {
        const { lessonId } = dto;
        return this.prisma.vocabulary.findMany({
            where: {
                lesson: {
                    id: lessonId, isDeleted: false 
                },
            },
            include: {
                medias: true
            }
        });
    }

    async findAllPublic(dto: FindVocabularyDto) {
        const { lessonId } = dto;
        return this.prisma.vocabulary.findMany({
            where: {
                lesson: {
                    id: lessonId, isDeleted: false 
                },
            },
            include: {
                medias: true
            }
        });
    }

    async findOneById(id: string) {
        return this.prisma.vocabulary.findUnique({
            where: {
                id 
            },
        });
    }

    async update(id: string, data: UpdateVocabularyDto) {
        const vocabulary = await this.prisma.vocabulary.findUnique({
            where: {
                id 
            } 
        });
        if (!vocabulary) throw new NotFoundException();
        const { value, explanation, index } = data;
        return this.prisma.vocabulary.update({
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
        const vocabulary = await this.prisma.vocabulary.findUnique({
            where: {
                id 
            } 
        });
        if (!vocabulary) throw new NotFoundException();
        return this.prisma.vocabulary.delete({
            where: {
                id 
            },
        });
    }
}
