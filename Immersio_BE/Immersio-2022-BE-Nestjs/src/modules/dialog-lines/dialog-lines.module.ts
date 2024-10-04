import { Module } from '@nestjs/common';
import { DialogLinesService } from './dialog-lines.service';
import { DialogLinesController } from './dialog-lines.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DialogLinesController],
    providers: [DialogLinesService]
})
export class DialogLinesModule {}
