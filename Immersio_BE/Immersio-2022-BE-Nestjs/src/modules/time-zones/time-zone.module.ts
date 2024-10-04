import { Module } from '@nestjs/common';
import { TimeZoneService } from './time-zone.service';
import { TimeZoneController } from './time-zone.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TimeZoneController],
    providers: [TimeZoneService]
})
export class TimeZoneModule {}
