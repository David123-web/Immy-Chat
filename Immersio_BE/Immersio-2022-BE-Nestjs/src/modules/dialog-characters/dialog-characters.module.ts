import { Module } from '@nestjs/common';
import { DialogCharactersService } from './dialog-characters.service';
import { DialogCharactersController } from './dialog-characters.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DialogCharactersController],
    providers: [DialogCharactersService]
})
export class DialogCharactersModule {}
