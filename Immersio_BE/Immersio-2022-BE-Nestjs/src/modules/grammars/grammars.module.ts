import { Module } from '@nestjs/common';
import { GrammarsService } from './grammars.service';
import { GrammarsController } from './grammars.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [GrammarsController],
    providers: [GrammarsService, PrismaService]
})
export class GrammarsModule {}
