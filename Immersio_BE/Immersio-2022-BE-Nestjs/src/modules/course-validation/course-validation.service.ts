import {ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import { LessonsService } from '../lessons/lessons.service';
import { VocabulariesService } from '../vocabularies/vocabularies.service';
import { FindVocabularyDto } from '../vocabularies/dto/find-vocabulary.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';
import { InjectKysely } from 'nestjs-kysely';

type CourseValidation = {
    courseId: number;
    courseTitle: string;
    hasCourseTitle: boolean;
    instructionVideo: boolean;
    hasSections: boolean; 
    hasLessons: boolean;
    isValid: boolean;
    lessons: Array<LessonValidation>;
  };


  type LessonValidation = {
    id: number;
    title: string;
    hasDialog: boolean;
    hasVocabulary: boolean;
  };

@Injectable()
export class CourseValidationService {

    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => CoursesService))
        private readonly coursesService: CoursesService,
        private readonly lessonsService: LessonsService,
        private readonly vocabulariesService: VocabulariesService,
       
    ) {}

    async validateCourse(subdomainId: string, userId: string, id:number) {
        const courseRecord = await this.coursesService.findOne(subdomainId, userId, id);
        let courseValidityData:CourseValidation  =  this.createEmptyValidityData();
        courseValidityData = this.validateCourseLevel(courseRecord, courseValidityData);
        
        courseValidityData = await this.validateLessonLevel(courseRecord, userId, courseValidityData);
        courseValidityData.isValid = this.isCourseValid(courseValidityData);
        const updateCourseDto = new UpdateCourseDto();
        updateCourseDto.isValid = courseValidityData.isValid;
        updateCourseDto.warnings = JSON.stringify(courseValidityData);
        await this.coursesService.update(userId, id, updateCourseDto);
        return courseValidityData;
    }



    async validateLessonLevel(courseRecord: any, userId: string, courseValidityData:CourseValidation ){
        const lessons:Array<any> = this.extractLessonDataFromCourse(courseRecord.sections);
       
        for(const lesson of lessons){
            const lessonDetail = await this.lessonsService.findOne(userId, lesson.id);
            let lessonValidityData = this.createEmptyLessonValidityData();
            lessonValidityData.id = lesson.id;
            lessonValidityData.title = lesson.title;
            if(lessonDetail.dialogs && lessonDetail.dialogs.length > 0){
                for (const dialog of lessonDetail.dialogs){
                    if (dialog.lines && dialog.lines.length > 0){
                        lessonValidityData.hasDialog = true;
                    }
                }
            }
            lessonValidityData = await this.validateVocabulary(lessonDetail.id,lessonValidityData );
            courseValidityData.lessons.push(lessonValidityData);
        }
        return courseValidityData;
    }

    async validateVocabulary(lessonId: number, lessonValidityData:LessonValidation){
        const findVocabularyDto = new FindVocabularyDto();
        findVocabularyDto.lessonId = lessonId;
        const lessonVocab = await this.vocabulariesService.findAll(findVocabularyDto);
        if(lessonVocab && lessonVocab.length > 0){
            lessonValidityData.hasVocabulary = true;
        }
        return lessonValidityData;
    }

    extractLessonDataFromCourse(sections: any){
        const arrayOut = [];
        for (const section of sections){
            if (section.lessons && section.lessons.length > 0) {
                for(const lesson of section.lessons){
                    arrayOut.push(lesson);
                }
            }
        }
        return arrayOut;
    }
    


    createEmptyValidityData() {
        const courseValidityData:CourseValidation  =  {
            courseId: 0, // Assuming 0 as a placeholder for the ID
            courseTitle: '',
            hasCourseTitle: true,
            instructionVideo: true,
            hasLessons: true,
            hasSections: true,
            isValid: true,
            lessons: [] // Empty array for lessons
        };
        return courseValidityData;
    }

    isCourseValid(courseValidityData){
        let finalDecision = true;
        if(!courseValidityData.hasCourseTitle ||
            !courseValidityData.instructionVideo ||
            !courseValidityData.hasLessons ||
            !courseValidityData.hasSections ||
            courseValidityData.lessons.length == 0){
            finalDecision = false;
        }
        for( const lesson of courseValidityData.lessons){
            if(!lesson.hasDialog ||
                !lesson.hasVocabulary){
                finalDecision = false;
            }
        }
        return finalDecision;
    }

    createEmptyLessonValidityData() {
        const lessonValidityData:LessonValidation  =  {
            id: 0,
            title: '',
            hasDialog: false,
            hasVocabulary: false,
        };
        return lessonValidityData;
    }

    validateCourseLevel(course: any, courseValidityData:CourseValidation ): CourseValidation {
        
        courseValidityData.courseId = course.id;
        courseValidityData.courseTitle = course.title;

        if (!course.instructionVideoId || course.instructionVideoId.trim() === '') {
            courseValidityData.instructionVideo = false;
        } 
      
        if (!course.title || course.title.trim() === '') {
            courseValidityData.hasCourseTitle = false;
        }
      
        if (!course.instructionVideo || Object.keys(course.instructionVideo).length === 0) {
            courseValidityData.instructionVideo = false;
        }
      
        if (!course.sections || course.sections.length === 0) {
            courseValidityData.hasSections = false;
        } else {
            this.hasLessons(course.sections, courseValidityData);
        }


      
        return courseValidityData;
    }

    hasLessons(sections, courseValidityData){
        let hasALesson = false;
        for (const section of sections){
            if (section.lessons && section.lessons.length > 0) {
                hasALesson = true;
            }
        }
        courseValidityData.hasLessons = hasALesson;
        return courseValidityData;
    }

}
