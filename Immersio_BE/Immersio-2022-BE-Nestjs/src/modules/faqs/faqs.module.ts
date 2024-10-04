import { Module } from '@nestjs/common';
import { FAQsService } from './faqs.service';
import { FAQsController } from './faqs.controller';
import { FAQCategoriesService } from './faqs-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [FAQsController],
    providers: [FAQsService, FAQCategoriesService]
})
export class FAQsModule {}
