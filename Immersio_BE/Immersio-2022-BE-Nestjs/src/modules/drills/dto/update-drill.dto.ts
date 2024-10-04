import { PartialType } from '@nestjs/swagger';
import { CreateDrillDto } from './create-drill.dto';

export class UpdateDrillDto extends PartialType(CreateDrillDto) {}
