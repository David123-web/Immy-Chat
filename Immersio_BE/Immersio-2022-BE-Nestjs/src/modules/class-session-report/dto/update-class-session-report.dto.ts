import { PartialType } from '@nestjs/swagger';
import { CreateClassSessionReportDto } from './create-class-session-report.dto';

export class UpdateClassSessionReportDto extends PartialType(CreateClassSessionReportDto) {}
