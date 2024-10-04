import { Module } from '@nestjs/common';
import { CourseTrackingService } from './course-tracking.service';
import { CourseTrackingController } from './course-tracking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CourseTrackingController],
    providers: [CourseTrackingService]
})
export class CourseTrackingModule {}
