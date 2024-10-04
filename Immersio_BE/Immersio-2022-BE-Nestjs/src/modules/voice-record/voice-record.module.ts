import { Module } from '@nestjs/common';
import { VoiceRecordService } from './voice-record.service';
import { VoiceRecordController } from './voice-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VoiceRecordController],
    providers: [VoiceRecordService]
})
export class VoiceRecordModule {}
