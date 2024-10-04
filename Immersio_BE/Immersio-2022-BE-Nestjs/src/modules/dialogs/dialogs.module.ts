import { Module } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { DialogsController } from './dialogs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DialogsController],
    providers: [DialogsService]
})
export class DialogsModule {}
