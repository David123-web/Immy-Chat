import { Module } from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { CampusesController } from './campuses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CampusRoomService } from './campus-rooms.service';
import { AvailableTimeService } from '../available-time/available-time.service';

@Module({
    imports: [PrismaModule],
    controllers: [CampusesController],
    providers: [CampusesService, CampusRoomService, AvailableTimeService],
})
export class CampusesModule {}
