
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseStudentDto } from './dto/create-coursestudent.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';


@Injectable()
export class CourseStudentService {
    constructor(private readonly prisma: PrismaService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async assignStudentToCourse(
        data: CreateCourseStudentDto,
    ) {
        try{
            await this._validateCourseAndUser(data);
            return await this._doAssignent(data);
        } catch(error){
            console.log(`ERROR in assignStudentToCourse ${JSON.stringify(error, null, 2)}`);
            throw new HttpException('Error assigning student to course', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async _validateCourseAndUser(data: CreateCourseStudentDto){
        const _user = await this.prisma.user.findUnique({
            where: {
                id: data.userId,
            },
        });
        const _course = await this.prisma.course.findUnique({
            where:{
                id: data.courseId
            }
        });
        if(!_user) throw new NotFoundException('Unknown User');
        if(!_course) throw new NotFoundException('Unknown Course');
    }

    async _doAssignent(
        data: CreateCourseStudentDto,
    ) {
        console.log(`_doAssignent ${JSON.stringify(data, null, 4)}`);
        const courseStudent = await this.prisma.courseStudent.upsert({
            where: {
                courseId_userId: {
                    courseId: data.courseId,
                    userId: data.userId,
                },
            },
            update: {
                purchased: data.purchased,
                active: data.active
            },
            create: {
                // Fields to create a new record
                courseId: data.courseId,
                userId: data.userId,
                purchased: data.purchased,
                active: data.active,
                studentId: data.studentId, 
                subdomainId: data.subdomainId,

            },
        });
        return courseStudent;
    }

    /***FOR UNIT TESTS ONLY! */
    async _deletedCourseStudent(userId: string, courseId: number) {
        
        return this.prisma.courseStudent.delete({
            where: {
                courseId_userId: {
                    userId,
                    courseId
                }
            },
        });
    }

    async hasPaid(userId: string, id: number) {
        const courseStudent = await this.db
            .selectFrom('CourseStudent')
            .where('courseId', '=', id)
            .where('userId', '=', userId)
            .where('purchased', '=', true)
            .selectAll()
            .executeTakeFirst();
        if (
            !courseStudent
        ){
            return false;
        }

        return courseStudent.purchased;
    }

    async isAssignedToCourse(userId: string, id: number) {
        const courseStudent = await this.db
            .selectFrom('CourseStudent')
            .where('courseId', '=', id)
            .where('userId', '=', userId)
            .selectAll()
            .executeTakeFirst();
        if (
            !courseStudent
        ){
            return false;
        } 

        return true;
    }
}