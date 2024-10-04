import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateGrammarDto from './dto/create-grammar.dto';
import { FindGrammarDto } from './dto/find-grammar.dto';
import UpdateGrammarDto from './dto/update-grammar.dto';

@Injectable()
export class GrammarsService {
    constructor(private readonly prisma: PrismaService) { }
    async create(data: CreateGrammarDto) {
        const { value, explanation, index } = data;
        return this.prisma.grammar.create({
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

    async findAll(dto: FindGrammarDto) {
        const { lessonId } = dto;
        return this.prisma.grammar.findMany({
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

    async findAllPublic(dto: FindGrammarDto) {
        const { lessonId } = dto;
        return this.prisma.grammar.findMany({
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
        return this.prisma.grammar.findUnique({
            where: {
                id 
            },
        });
    }

    async update(id: string, data: UpdateGrammarDto) {
        const phrase = await this.prisma.grammar.findUnique({
            where: {
                id 
            } 
        });
        if (!phrase) throw new NotFoundException();
        const { value, explanation, index } = data;
        return this.prisma.grammar.update({
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
        const phrase = await this.prisma.grammar.findUnique({
            where: {
                id 
            } 
        });
        if (!phrase) throw new NotFoundException();
        return this.prisma.grammar.delete({
            where: {
                id 
            },
        });
    }
}
