import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RootSettingsService } from './root-settings.service';
import { RootSettingsController } from './root-settings.controller';

@Module({
    imports: [PrismaModule],
    controllers: [RootSettingsController],
    providers: [RootSettingsService]
})
export class RootSettingsModule { }
