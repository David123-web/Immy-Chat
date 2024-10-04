import { Module } from '@nestjs/common';
import { DrillsService } from './drills.service';
import { DrillsController } from './drills.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [DrillsController],
    providers: [DrillsService, PrismaService]
})
export class DrillsModule {}
