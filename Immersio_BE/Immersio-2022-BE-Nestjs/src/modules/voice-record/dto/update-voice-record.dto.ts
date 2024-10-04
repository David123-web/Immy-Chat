import { PartialType } from '@nestjs/swagger';
import { AddVoiceRecordDto } from './add-voice-record.dto';

export class UpdateVoiceRecordDto extends PartialType(AddVoiceRecordDto) {}
