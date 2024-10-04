import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { BlogCategoriesService } from './blog-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BlogsController],
    providers: [BlogsService, BlogCategoriesService]
})
export class BlogsModule {}
