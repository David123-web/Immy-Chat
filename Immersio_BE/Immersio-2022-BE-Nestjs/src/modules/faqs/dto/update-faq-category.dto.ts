import { PartialType } from '@nestjs/swagger';
import { CreateFAQCategoryDto } from './create-faq-category.dto';

export class UpdateFAQCategoryDto extends PartialType(CreateFAQCategoryDto) {}
