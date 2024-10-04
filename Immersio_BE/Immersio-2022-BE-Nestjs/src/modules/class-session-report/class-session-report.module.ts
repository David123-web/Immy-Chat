import { Module } from '@nestjs/common';
import { ClassSessionReportService } from './class-session-report.service';
import { ClassSessionReportController } from './class-session-report.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [ClassSessionReportController],
    providers: [ClassSessionReportService],
    imports: [PrismaModule],
})
export class ClassSessionReportModule {}
