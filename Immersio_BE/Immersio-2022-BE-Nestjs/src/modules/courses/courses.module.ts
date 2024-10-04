import {MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CommonCourseModule } from '../common-course/common-course.module';
import { FreeCoursesMiddleware } from './courses.middleware';

@Module({
    imports: [CommonCourseModule],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(FreeCoursesMiddleware).forRoutes(
            {
                path: 'courses',
                method: RequestMethod.POST,
            },
            {
                path: 'courses/*',
                method: RequestMethod.PATCH,
            }
        );
    }
}
