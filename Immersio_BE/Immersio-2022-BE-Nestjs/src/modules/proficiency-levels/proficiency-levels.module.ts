import { Module } from '@nestjs/common';
import { ProficiencyLevelsService } from './proficiency-levels.service';
import { ProficiencyLevelsController } from './proficiency-levels.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ProficiencyLevelsController],
    providers: [ProficiencyLevelsService]
})
export class ProficiencyLevelsModule {}
