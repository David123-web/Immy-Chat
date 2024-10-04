import { Module } from '@nestjs/common';
import { PhrasesService } from './phrases.service';
import { PhrasesController } from './phrases.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [PhrasesController],
    providers: [PhrasesService, PrismaService]
})
export class PhrasesModule {}
