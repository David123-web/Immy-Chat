import { PartialType } from '@nestjs/swagger';
import { CreateDialogCharacterDto } from './create-dialog-character.dto';

export class UpdateDialogCharacterDto extends PartialType(CreateDialogCharacterDto) {}
