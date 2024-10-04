import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import LessonDataDto from '../../lessons/dto/data-lesson.dto';

export default class UpdateVocabularyDto extends LessonDataDto {}
