import { PartialType } from '@nestjs/swagger';
import { CreateDialogLineDto } from './create-dialog-line.dto';

export class UpdateDialogLineDto extends PartialType(CreateDialogLineDto) {}
