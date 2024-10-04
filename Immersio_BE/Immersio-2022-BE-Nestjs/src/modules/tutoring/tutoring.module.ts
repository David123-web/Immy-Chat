import { Module } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { TutoringController } from './tutoring.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TutoringController],
    providers: [TutoringService],
})
export class TutoringModule {}
