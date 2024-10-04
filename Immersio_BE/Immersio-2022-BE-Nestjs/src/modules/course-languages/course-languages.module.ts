import { Module } from '@nestjs/common';
import { CourseLanguagesService } from './course-languages.service';
import { CourseLanguagesController } from './course-languages.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CourseLanguagesController],
    providers: [CourseLanguagesService]
})
export class CourseLanguagesModule {}
