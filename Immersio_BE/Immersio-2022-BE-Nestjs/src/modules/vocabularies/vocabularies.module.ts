import { Module } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesController } from './vocabularies.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [VocabulariesController],
    providers: [VocabulariesService, PrismaService]
})
export class VocabulariesModule {}
