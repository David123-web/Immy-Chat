import { PartialType } from '@nestjs/swagger';
import { CreateCourseTrackingDto } from './create-course-tracking.dto';

export class UpdateCourseTrackingDto extends PartialType(CreateCourseTrackingDto) {}
