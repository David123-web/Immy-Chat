import { Module } from '@nestjs/common';
import { AvailableTimeService } from './available-time.service';
import { AvailableTimeController } from './available-time.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [AvailableTimeController],
    providers: [AvailableTimeService],
    imports: [PrismaModule],
})
export class AvailableTimeModule {}
