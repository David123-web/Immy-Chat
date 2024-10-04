import {ForbiddenException,
    Injectable,
    NotFoundException,
    Inject,
    forwardRef,
    Logger,} from '@nestjs/common';
import { searchWithKeys } from 'src/utils/object';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import FindCourseDto from './dto/find-course.dto';
import { CreateCourseStudentDto } from '../course-student/dto/create-coursestudent.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Parser } from 'json2csv';
import { Readable } from 'stream';
import { DialogLine, Gender, NotificationType, Role } from '@prisma/client';
import { InviteCoInstructorDto } from './dto/invite-coinstructor';
import { SendEmailHelper } from 'src/helpers/send-email';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import {BadRequestException,
    ConflictException,
    InternalServerErrorException,} from '@nestjs/common/exceptions';
import { NotificationsService } from '../notifications/notifications.service';
import {getSubdomainUrl,
    jsonCourseDataConvertStep1,
    jsonCourseDataConvertStep2,} from 'src/helpers/common';
import { replaceWithCDN } from 'src/helpers/s3';
import * as csvToJson from 'csvtojson';
import { FilesService } from '../files/files.service';
import slugify from 'slugify';
import * as cuid from 'cuid';
import { SectionsService } from '../sections/sections.service';
import { LessonsService } from '../lessons/lessons.service';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DialogsService } from '../dialogs/dialogs.service';
import { DialogLinesService } from '../dialog-lines/dialog-lines.service';
import { LIMIT_INVITE_INSTRUCTOR, TOKEN_EXPIRES } from 'src/common/constants';
import { CourseType } from '@prisma/client';

@Injectable()
export class CoursesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly notificationService: NotificationsService,
        private readonly filesService: FilesService,
        private readonly sectionsService: SectionsService,
        @Inject(forwardRef(() => LessonsService))
        private readonly lessonsService: LessonsService,
        private readonly dialogsService: DialogsService,
        private readonly dialogLinesService: DialogLinesService,
        private readonly usersService: UsersService,

        @InjectKysely() private db: Kysely<DB>
    ) {}

    async _autoGenerateInstructorProfile(
        userId: string,
        courseLanguageId: number
    ) {
        const user: any = await this.usersService.getUserDetail(userId);

        const changeProfileDto = {
            firstName: '',
            lastName: '',
            bio: '',
            address: '',
            avatarUrl: '',
            dob: null,
            gender: Gender.OTHER,
            phoneNumber: '',
            socialLinks: {
                facebook: '',
                twitter: '',
                youtube: '',
                linkedin: '',
                instagram: '',
            },
            hourRate: 0,
            teachLanguages: [courseLanguageId],
            role: Role.INSTRUCTOR,
            languageCodes: [],
        };

        const changeInstructorOrTutorProfileDto = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dialCode: '',
            languageCodes: [],
            website: '',
            role: Role.INSTRUCTOR,
            qualificationDesc: '',
            experienceDesc: '',
            teachLanguages: [courseLanguageId],
            avatarUrl: '',
            bio: '',
            title: '',
            hourRate: 0,
        };
        const { updatedInstructor, updatedTutor } =
            await this.usersService.createInstructorOrTutorProfile(
                user,
                changeInstructorOrTutorProfileDto,
                changeProfileDto,
                true,
                false
            );
        return {
            updatedInstructor,
            updatedTutor,
        };
    }

    async create(
        subdomainId: string,
        userId: string,
        { lessons, tagIds, tutorIds, ...data }: CreateCourseDto
    ) {
        this.determineIsFree(data);

        const _user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                profile: {
                    select: {
                        instructor: true,
                    },
                },
            },
        });

        let instructorId = _user?.profile?.instructor?.id;
        if (!_user.profile?.instructor?.id) {
            const { updatedInstructor } =
                await this._autoGenerateInstructorProfile(
                    userId,
                    data.courseLanguageId
                );
            instructorId = updatedInstructor.id;
        }

        const result = await this.prisma.course.create({
            data: {
                ...data,
                instructorId: instructorId,
                userId,
                subdomainId,
                tags: Array.isArray(tagIds)
                    ? {
                        connect: tagIds.map((id: number) => ({
                            id,
                        })),
                    }
                    : undefined,
                tutors: Array.isArray(tutorIds)
                    ? {
                        connect: tutorIds.map((id: number) => ({
                            id,
                        })),
                    }
                    : undefined,
            },
            select: {
                title: true,
                id: true,
                user: {
                    select: {
                        profile: true,
                    },
                },
            },
        });

        /* -------------------------- Create tutoring plan -------------------------- */
        if (tutorIds && !!tutorIds.length) {
            await this.prisma.tutoringPlan.createMany({
                data: tutorIds.map((id) => ({
                    courseId: result.id,
                    tutorId: id,
                })),
            });
        }

        /* ------------------------ Send notification tutors ------------------------ */
        if (tutorIds && !!tutorIds.length) {
            this.prisma.user
                .findMany({
                    where: {
                        profile: {
                            tutorId: {
                                in: tutorIds,
                            },
                        },
                    },
                    select: {
                        id: true,
                    },
                })
                .then((_user) => {
                    _user.forEach((u) => {
                        this.notificationService.create(u.id, {
                            title: 'Immersio - Invited as Tutor',
                            body: `${result.user.profile.firstName} ${result.user.profile.lastName} has sent you an invitation to be a tutor of the course ${result.title}`,
                            type: 'INVITE_AS_TUTOR',
                            metadata: {
                                profile: result.user.profile,
                                courseId: {
                                    id: result.id,
                                    name: result.title,
                                },
                            },
                        });
                    });
                });
        }

        if (data.isPublished) {
            await this.prisma.course.update({
                where: {
                    id: result.id,
                },
                data: {
                    instructionVideo: {
                        update: {
                            public: true,
                        },
                    },
                    thumbnail: {
                        update: {
                            public: true,
                        },
                    },
                },
            });
        }

        return replaceWithCDN(result, ['s3Location']);
    }

    async findPaid(subdomainId: string, userId: string, dto: FindCourseDto) {
        const allCourses = await this.findAll(subdomainId, userId, dto);
        const paidCourses = allCourses.filter(
            (course) => course.courseType === CourseType.PAID
        );

        return {
            data: paidCourses,
            total: paidCourses.length,
        };
    }

    async findAll(
        subdomainId: string,
        userId: string,
        {
            skip,
            take,
            cursorId,
            title: contains,
            sortBy,
            sortDesc,
            isDeleted,
        }: FindCourseDto
    ) {
        const user = await this.db
            .selectFrom('User')
            .where('id', '=', userId)
            .select(['id', 'role', 'subdomainId'])
            .executeTakeFirst();
        const conditions: any = {
        };
        switch (user.role) {
        case Role.SUPER_ADMIN:
            break;
        case Role.SUBDOMAIN_ADMIN:
            conditions.subdomainId = user.subdomainId;
            break;
        case Role.INSTRUCTOR:
            conditions.subdomainId = user.subdomainId;
            conditions.OR = [
                {
                    userId: user.id,
                },
                {
                    coInstructors: {
                        some: {
                            profile: {
                                userId: user.id,
                            },
                        },
                    },
                },
            ];
            break;
        case Role.TUTOR:
            conditions.tutors = {
                some: {
                    profile: {
                        userId,
                    },
                },
            };
            break;
        case Role.STUDENT:
            conditions.trackings = {
                some: {
                    userId,
                },
            };
            break;
        default:
            return [];
        }
        const courses = await this.prisma.course.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                ...conditions,
                subdomainId,
                AND: {
                    OR:
                        contains &&
                        searchWithKeys(['title'], contains, 'insensitive'),
                },
                isDeleted: isDeleted === true,
            },
            include: {
                instructor: true,
                sections: {
                    where: {
                        isDeleted: false,
                    },
                    include: {
                        lessons: {
                            where: {
                                isDeleted: false,
                            },
                        },
                    },
                },
                coInstructors: true,
                instructionVideo: true,
                thumbnail: true,
                tags: true,
                _count: {
                    select: {
                        sections: true,
                    },
                },
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
        return courses.map((i) => replaceWithCDN(i, ['s3Location']));
    }

    async removeCoInstructor(
        userId: string,
        { courseId, instructorId }: InviteCoInstructorDto
    ) {
        const [user, course] = await Promise.all([
            this.db
                .selectFrom('User')
                .where('id', '=', userId)
                .select(['id', 'role'])
                .executeTakeFirst(),
            this.db
                .selectFrom('Course')
                .where('id', '=', courseId)
                .select('userId')
                .executeTakeFirst(),
        ]);
        if (
            course.userId !== user.id &&
            ![Role.SUPER_ADMIN, Role.SUPER_ADMIN].includes(user.role as any)
        )
            throw new ForbiddenException();
        await this.prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                coInstructors: {
                    disconnect: {
                        id: instructorId,
                    },
                },
            },
        });

        return true;
    }

    async inviteCoInstructor(
        userId: string,
        subdomainId: string,
        { courseId, instructorId }: InviteCoInstructorDto
    ) {
        const course = await this.prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                user: {
                    select: {
                        profile: {
                            select: {
                                avatarUrl: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) throw new NotFoundException('Course not found!');

        const instructor = await this.prisma.instructor.findUnique({
            where: {
                id: instructorId,
            },
            include: {
                profile: {
                    select: {
                        user: {
                            select: {
                                email: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (!instructor) throw new NotFoundException('Instructor not found!');

        if (course.userId !== userId) throw new ForbiddenException();

        const existedInvitation = await this.db
            .selectFrom('Invitation')
            .where('courseId', '=', courseId)
            .where('instructorId', '=', instructorId)
            .where(
                'createdAt',
                '>',
                new Date(Date.now() - TOKEN_EXPIRES.INVITE_INSTRUCTOR * 1000)
            )
            .selectAll()
            .execute();

        if (existedInvitation.length > LIMIT_INVITE_INSTRUCTOR) {
            throw new ForbiddenException(
                'You can not invite more than ' +
                    LIMIT_INVITE_INSTRUCTOR +
                    ' times!'
            );
        }

        const invitation = await this.prisma.invitation.create({
            data: {
                courseId,
                instructorId,
            },
        });

        const token = this.jwtService.sign(
            {
                id: invitation.id,
                instructorId,
                courseId,
                type: 'INVITE_AS_COINSTRUCTOR',
                subdomainId: course.subdomainId,
            },
            {
                expiresIn: TOKEN_EXPIRES.INVITE_INSTRUCTOR,
            }
        );

        const templatePath = join(
            __dirname,
            './../../../client/html/invite-as-coinstructor.html'
        );

        const subdomainUrl = await getSubdomainUrl(this.db, subdomainId);

        const _emailHelper = new SendEmailHelper();
        _emailHelper.send(
            instructor.profile.user.email,
            'Immersio - Invited as Co-Instructor',
            templatePath,
            {
                link: `${subdomainUrl}/accept-invitation?hashcode=${token}`,
                link2: `${subdomainUrl}/reject-invitation?hashcode=${token}`,
                courseName: course.title,
            }
        );

        this.notificationService.create(instructor.profile.user.id, {
            title: 'Immersio - Invited as Co-Instructor',
            body: `${course.user.profile.firstName} ${course.user.profile.lastName} has sent you an invitation to be a co-creator of the course ${course.title}`,
            type: 'INVITE_AS_COINSTRUCTOR',
            refId: course.id.toString(),
            metadata: {
                profile: course.user.profile,
                courseId: {
                    id: course.id,
                    name: course.title,
                },
                token,
            },
        });

        return invitation;
    }

    async acceptCoInstructorInvitation(token: string) {
        const decoded = this.jwtService.verify(token);
        if (decoded.type !== 'INVITE_AS_COINSTRUCTOR')
            throw new BadRequestException('Invalid token!');
        const invitation = await this.db
            .selectFrom('Invitation')
            .where('id', '=', decoded.id)
            .select('courseId')
            .executeTakeFirst();
        if (!invitation) throw new NotFoundException('Invitation not found!');
        const course = await this.db
            .selectFrom('Course')
            .where('id', '=', decoded.courseId)
            .executeTakeFirst();
        if (!course) throw new NotFoundException('Course not found!');
        const inv = await this.prisma.invitation.update({
            where: {
                id: decoded.id,
            },
            data: {
                instructor: {
                    update: {
                        coInstructorToCourses: {
                            connect: {
                                id: invitation.courseId,
                            },
                        },
                    },
                },
            },
            select: {
                instructor: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });
        // await this.prisma.course.update({
        //     where: {
        //         id: decoded.courseId
        //     },
        //     data: {
        //         coInstructors: {
        //             connect: {
        //                 id: decoded.instructorId
        //             }
        //         }
        //     },
        // });

        await this.db
            .deleteFrom('Invitation')
            .where('id', '=', decoded.id)
            .executeTakeFirst();
        await this._disableInvitationNoti(
            inv.instructor.profile.userId,
            invitation.courseId
        );

        return true;
    }

    private async _disableInvitationNoti(userId: string, courseId: number) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                refId: courseId.toString(),
                type: NotificationType.INVITE_AS_COINSTRUCTOR,
            },
            data: {
                disabled: true,
            },
        });
    }

    async rejectCoInstructorInvitation(token: string) {
        const decoded = this.jwtService.verify(token);
        if (decoded.type !== 'INVITE_AS_COINSTRUCTOR')
            throw new BadRequestException('Invalid token!');
        const invitation = await this.db
            .selectFrom('Invitation')
            .where('id', '=', decoded.id)
            .select('courseId')
            .executeTakeFirst();
        if (!invitation) throw new NotFoundException('Invitation not found!');
        const inv = await this.prisma.invitation.delete({
            where: {
                id: decoded.id,
            },
            select: {
                instructor: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });

        await this._disableInvitationNoti(
            inv.instructor.profile.userId,
            invitation.courseId
        );

        return true;
    }

    async findAllPublic(
        subdomainId: string,
        {
            skip,
            take,
            cursorId,
            title: contains,
            sortBy,
            sortDesc,
        }: FindCourseDto
    ) {
        const courses = await this.db
            .selectFrom('Course')
            .where('subdomainId', '=', subdomainId)
            .where('isPublished', '=', true)
            .where('isDeleted', '=', false)
            .where('isValid', '=', true)
            .$if(!!contains, (eb) =>
                eb.where('title', 'ilike', `%${contains}%`)
            )
            .$if(!!skip, (eb) => eb.offset(skip))
            .$if(!!take, (eb) => eb.offset(take))
            .$if(!!cursorId, (eb) => eb.where('id', '>', cursorId))
            .$if(!!sortBy && !!sortDesc, (eb) =>
                eb.orderBy(sortBy as any, sortDesc ? 'desc' : 'asc')
            )
            .selectAll()
            .execute();
        return courses.map((i) => replaceWithCDN(i, ['s3Location']));
    }

    async findAllPublish(
        subdomainId: string,
        {
            skip,
            take,
            cursorId,
            title: contains,
            sortBy,
            sortDesc,
        }: FindCourseDto
    ) {
        const where = {
            subdomainId,
            isPublished: true,
            OR: contains && searchWithKeys(['title'], contains, 'insensitive'),
        };

        const [courses, total] = await Promise.all([
            this.prisma.course.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId,
                },
                where: {
                    AND: {
                        isValid: true,
                        ...where,
                    },
                },
                include: {
                    instructor: true,
                    sections: {
                        where: {
                            isDeleted: false,
                        },
                        include: {
                            lessons: {
                                where: {
                                    isDeleted: false,
                                },
                            },
                        },
                    },
                    coInstructors: true,
                    instructionVideo: true,
                    thumbnail: true,
                    tags: true,
                    _count: {
                        select: {
                            sections: true,
                        },
                    },
                },
                orderBy: sortBy
                    ? {
                        [sortBy]: sortDesc ? 'desc' : 'asc',
                    }
                    : {
                    },
            }),
            this.prisma.course.count({
                where: {
                    AND: {
                        isValid: true,
                        ...where,
                    },
                },
            }),
        ]);

        return {
            total,
            data: courses.map((i) => replaceWithCDN(i, ['s3Location'])),
        };
    }

    async findOne(subdomainId: string, userId: string, id: number) {
        const { myProfile, tags, tutors, coInstructors } = await this.db
            .selectNoFrom((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Profile')
                        .where('userId', '=', userId)
                        .selectAll()
                ).as('myProfile'),
                jsonArrayFrom(
                    eb
                        .selectFrom('_CourseToTag')
                        .where('A', '=', id)
                        .select('B')
                ).as('tags'),
                jsonArrayFrom(
                    eb
                        .selectFrom('_CourseToTutor')
                        .where('A', '=', id)
                        .select('B')
                ).as('tutors'),
                jsonArrayFrom(
                    eb
                        .selectFrom('_CoInstructorToCourse')
                        .where('A', '=', id)
                        .select('B')
                ).as('coInstructors'),
            ])
            .executeTakeFirst();
        const course = await this.db
            .selectFrom('Course')
            .where('subdomainId', '=', subdomainId)
            .where('id', '=', id)
            .selectAll()
            .select((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Instructor')
                        .whereRef('id', '=', 'Course.instructorId')
                        .selectAll()
                ).as('instructor'),
                jsonObjectFrom(
                    eb
                        .selectFrom('File')
                        .whereRef('id', '=', 'Course.instructionVideoId')
                        .selectAll()
                ).as('instructionVideo'),
                jsonArrayFrom(
                    eb
                        .selectFrom('CourseSection')
                        .whereRef('courseId', '=', 'Course.id')
                        .selectAll()
                        .select((eb) => [
                            jsonObjectFrom(
                                eb
                                    .selectFrom('Course')
                                    .whereRef(
                                        'id',
                                        '=',
                                        'CourseSection.courseId'
                                    )
                                    .selectAll()
                            ).as('course'),
                            jsonArrayFrom(
                                eb
                                    .selectFrom('Lesson')
                                    .whereRef(
                                        'courseSectionId',
                                        '=',
                                        'CourseSection.id'
                                    )
                                    .where('isDeleted', '=', false)
                                    .selectAll()
                            ).as('lessons'),
                        ])
                ).as('sections'),
            ])
            .$if(tags.length > 0, (eb) =>
                eb.select((eb) =>
                    jsonArrayFrom(
                        eb
                            .selectFrom('Tag')
                            .where(
                                'id',
                                'in',
                                tags.map((t) => t.B)
                            )
                            .selectAll()
                    ).as('tags')
                )
            )
            .$if(tutors.length > 0, (eb) =>
                eb.select((eb) =>
                    jsonArrayFrom(
                        eb
                            .selectFrom('Tutor')
                            .where(
                                'id',
                                'in',
                                tutors.map((t) => t.B)
                            )
                            .select((eb) => [
                                'id',
                                jsonObjectFrom(
                                    eb
                                        .selectFrom('Profile')
                                        .whereRef('tutorId', '=', 'Tutor.id')
                                        .select(['firstName', 'lastName'])
                                ).as('profile'),
                            ])
                    ).as('tutors')
                )
            )
            .$if(coInstructors.length > 0, (eb) =>
                eb.select((eb) =>
                    jsonArrayFrom(
                        eb
                            .selectFrom('Instructor')
                            .where(
                                'id',
                                'in',
                                coInstructors.map((t) => t.B)
                            )
                            .select((eb) => [
                                jsonObjectFrom(
                                    eb
                                        .selectFrom('Profile')
                                        .whereRef(
                                            'instructorId',
                                            '=',
                                            'Instructor.id'
                                        )
                                        .select([
                                            'userId',
                                            'avatarUrl',
                                            'firstName',
                                            'lastName',
                                            'instructorId',
                                        ])
                                ).as('profile'),
                            ])
                    ).as('coInstructors')
                )
            )
            .executeTakeFirst();
        course.coInstructors = course.coInstructors || [];
        course.tutors = course.tutors || [];
        course.tags = course.tags || [];
        if (
            !(
                course.isPublished ||
                course.userId === userId ||
                course.instructor?.id === myProfile?.instructorId ||
                course.coInstructors?.find(
                    (co) => co.profile.userId === userId
                ) ||
                course.tutors?.find((t) => t.id === myProfile?.tutorId)
            )
        ) {
            throw new NotFoundException();
        }

        if (!course) throw new NotFoundException();
        const courseOut = replaceWithCDN(course, ['s3Location']);
        return courseOut;
    }


    
    async getCourseTypes(){
        return  Object.values(CourseType);
    }


    async checkPermission(userId: string, id: number) {
        const [user, course] = await Promise.all([
            this.db
                .selectFrom('User')
                .where('id', '=', userId)
                .select(['id', 'role', 'subdomainId'])
                .executeTakeFirst(),
            this.prisma.course.findUnique({
                where: {
                    id,
                },
                select: {
                    isFree: true,
                    subdomainId: true,
                    students: {
                        where: {
                            student: {
                                profile: {
                                    userId,
                                },
                            },
                        },
                    },
                    tutors: {
                        where: {
                            profile: {
                                userId,
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                        },
                    },
                    coInstructors: {
                        where: {
                            profile: {
                                userId,
                            },
                        },
                    },
                },
            }),
        ]);
        return {
            result:
                course && // Course exist
                (course.isFree || // Course is free
                    course.students.length > 0 || // User is student
                    course.coInstructors.length > 0 || // User is co-instructor
                    course.tutors.length > 0 || // User is tutor
                    course.user.id === userId || // User is course owner
                    user.role === Role.SUPER_ADMIN || // User is super admin
                    (user.role === Role.SUBDOMAIN_ADMIN &&
                        user.subdomainId === course.subdomainId)), // User is subdomain admin
        };
    }

    async checkPublicPermission(id: number) {
        const course = await this.db
            .selectFrom('Course')
            .where('id', '=', id)
            .select('isFree')
            .executeTakeFirst();
        return {
            result: course && course.isFree,
        };
    }

    async findOnePublic(subdomainId: string, id: number) {
        const course = await this.prisma.course.findUnique({
            where: {
                id,
            },
            include: {
                sections: {
                    where: {
                        isDeleted: false,
                    },
                    include: {
                        lessons: {
                            where: {
                                isDeleted: false,
                            },
                        },
                    },
                },
                tags: true,
                instructor: true,
                tutors: true,
                instructionVideo: true,
                coInstructors: {
                    select: {
                        profile: {
                            select: {
                                userId: true,
                                avatarUrl: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!course) throw new NotFoundException();
        return replaceWithCDN(course, ['s3Location']);
    }

    determineIsFree(data) {
        if (data.courseType === CourseType.FREE) {
            data.isFree = true;
        } else {
            data.isFree = false;
        }
    }

    async update(
        userId: string,
        id: number,
        { lessons, tagIds, tutorIds, ...data }: UpdateCourseDto
    ) {
        this.determineIsFree(data);
        const course = await this.prisma.course.findUnique({
            where: {
                id,
            },
            include: {
                coInstructors: {
                    include: {
                        profile: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
                tags: true,
                tutors: true,
            },
        });
        if (!course) throw new NotFoundException();

        const user = await this.db
            .selectFrom('User')
            .where('id', '=', userId)
            .selectAll()
            .executeTakeFirst();
        if (!user) throw new InternalServerErrorException();
        const acceptableRoles = [
            Role.SUBDOMAIN_ADMIN,
            Role.SUPER_ADMIN,
            Role.INSTRUCTOR,
        ];
        const isCoInstructor = course.coInstructors
            .map((ci) => ci.profile.userId)
            .includes(userId);

        if (
            course.userId !== userId &&
            !isCoInstructor &&
            !acceptableRoles.includes(user.role as any)
        )
            throw new ForbiddenException();

        // Get current tutor ids
        let addNewTutorIds = [];
        let removeTutorIds = [];

        if (tutorIds && !!tutorIds.length) {
            const currentTutorIds = course.tutors.map((tutor) => tutor.id);
            addNewTutorIds = tutorIds.filter(
                (id) => !currentTutorIds.includes(id)
            );
            removeTutorIds = currentTutorIds.filter(
                (id) => !tutorIds.includes(id)
            );
        }

        const result = await this.prisma.course.update({
            where: {
                id,
            },
            data: {
                ...data,
                tags: {
                    disconnect: course.tags.map((i) => ({
                        id: i.id,
                    })),
                    connect: Array.isArray(tagIds)
                        ? tagIds.map((id: number) => ({
                            id,
                        }))
                        : undefined,
                },
                // TODO: Remove this comment later
                // coInstructors: {
                //     disconnect: course.coInstructors.map((i) => ({ id: i.id })),
                //     connect: Array.isArray(coInstructorIds)
                //         ? coInstructorIds.map((id: number) => ({ id }))
                //         : undefined,
                // },
                tutors: {
                    disconnect: course.tutors.map((i) => ({
                        id: i.id,
                    })),
                    connect: Array.isArray(tutorIds)
                        ? tutorIds.map((id: number) => ({
                            id,
                        }))
                        : undefined,
                },
            },
            select: {
                title: true,
                id: true,
                user: {
                    select: {
                        profile: true,
                    },
                },
            },
        });

        /* --------------------- Update and create tutoring plan -------------------- */

        if (!!addNewTutorIds.length || !!removeTutorIds.length) {
            const currentTutoringPlans =
                await this.prisma.tutoringPlan.findMany({
                    where: {
                        courseId: result.id,
                        tutorId: {
                            in: [...addNewTutorIds, ...removeTutorIds],
                        },
                    },
                    select: {
                        id: true,
                        courseId: true,
                        tutorId: true,
                    },
                });

            if (addNewTutorIds.length) {
                addNewTutorIds.forEach(async (id) => {
                    const tutoringPlan = currentTutoringPlans.find(
                        (tp) => tp.tutorId === id
                    );
                    if (!tutoringPlan) {
                        await this.prisma.tutoringPlan.create({
                            data: {
                                courseId: result.id,
                                tutorId: id,
                            },
                        });
                    } else {
                        await this.prisma.tutoringPlan.update({
                            where: {
                                id: tutoringPlan.id,
                            },
                            data: {
                                isEnabled: true,
                            },
                        });
                    }
                });
            }

            if (removeTutorIds.length) {
                removeTutorIds.forEach(async (id) => {
                    const tutoringPlan = currentTutoringPlans.find(
                        (tp) => tp.tutorId === id
                    );
                    await this.prisma.tutoringPlan.update({
                        where: {
                            id: tutoringPlan.id,
                        },
                        data: {
                            isEnabled: false,
                        },
                    });
                });
            }
        }

        /* --------------------------- Send notify cation --------------------------- */
        if (tutorIds && !!tutorIds.length) {
            this.prisma.user
                .findMany({
                    where: {
                        profile: {
                            tutorId: {
                                in: addNewTutorIds,
                            },
                        },
                    },
                    select: {
                        id: true,
                    },
                })
                .then((_user) => {
                    _user.forEach((u) => {
                        this.notificationService.create(u.id, {
                            title: 'Immersio - Invited as Tutor',
                            body: `${result.user.profile.firstName} ${result.user.profile.lastName} has sent you an invitation to be a tutor of the course ${result.title}`,
                            type: 'INVITE_AS_TUTOR',
                            metadata: {
                                profile: result.user.profile,
                                courseId: {
                                    id: result.id,
                                    name: result.title,
                                },
                            },
                        });
                    });
                });
        }

        if (typeof data.isPublished === 'boolean')
            await this.prisma.course.update({
                where: {
                    id,
                },
                data: {
                    instructionVideo: {
                        update: {
                            public: data.isPublished,
                        },
                    },
                    thumbnail: {
                        update: {
                            public: data.isPublished,
                        },
                    },
                },
            });

        return replaceWithCDN(result, ['s3Location']);
    }

    async downloadCSV(
        subdomainId: string,
        userId: string,
        {
            skip,
            take,
            cursorId,
            title: contains,
            sortBy,
            sortDesc,
        }: FindCourseDto
    ) {
        const courses = this.findAll(subdomainId, userId, {
            skip,
            take,
            cursorId,
            title: contains,
            sortBy,
            sortDesc,
        });

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(courses);
        return Readable.from(csv);
    }

    async remove(userId: string, id: number) {
        await this._checkValid(userId, id);
        return this.prisma.course.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            },
        });
    }

    async recycle(userId: string, id: number) {
        await this._checkValid(userId, id);
        return this.prisma.course.update({
            where: {
                id,
            },
            data: {
                isDeleted: false,
                deletedAt: null,
            },
        });
    }

    async permanentDelete(userId: string, id: number) {
        await this._checkValid(userId, id);
        return this.prisma.course.delete({
            where: {
                id,
            },
        });
    }

    async _checkValid(userId: string, courseId: number) {
        // const course = await this.db.selectFrom("Course")
        //     .where("id", "=", courseId)
        //     .select("userId")
        //     .executeTakeFirst();
        // if (!course) throw new NotFoundException();
        // const user = await this.db.selectFrom("User")
        //     .where("id", "=", userId)
        //     .select(["role"])
        //     .executeTakeFirst();

        const { course, user } = await this.db
            .selectNoFrom((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Course')
                        .where('id', '=', courseId)
                        .select('userId')
                ).as('course'),
                jsonObjectFrom(
                    eb
                        .selectFrom('User')
                        .where('id', '=', userId)
                        .select('role')
                ).as('user'),
            ])
            .executeTakeFirst();
        if (!user) throw new NotFoundException('User info not found!');
        if (
            course.userId !== userId &&
            ![Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN].includes(user.role as any)
        )
            throw new ForbiddenException();
    }

    async importCourseStep1(
        subdomainId: string,
        userId: string,
        file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('File not found!');
        }

        const csvString = file.buffer.toString('utf8');
        const jsonData = await csvToJson().fromString(csvString);

        const step1DataConverted = jsonCourseDataConvertStep1(jsonData);

        const coursesCreated = await Promise.all(
            step1DataConverted.map(async (course) => {
                try {
                    const [
                        courseLanguage,
                        courseLevel,
                        instructionVideo,
                        courseTag,
                    ] = await Promise.all([
                        this.prisma.courseLanguage.findFirst({
                            where: {
                                name: course.course_language,
                            },
                        }),
                        this.prisma.level.findFirst({
                            where: {
                                name: course.course_level,
                            },
                        }),
                        this.filesService.addExternalFile(userId, {
                            name:
                                slugify(course.course_title) +
                                '-instructionVideo-' +
                                cuid(),
                            link: course.course_video_url,
                        }),
                        this.prisma.tag.findFirst({
                            where: {
                                name: course.course_tag,
                                subdomainId,
                            },
                        }),
                    ]);

                    const slug = slugify(course.course_title);

                    if (!courseLanguage)
                        throw new Error('Course language not found!');

                    if (!courseLevel)
                        throw new Error('Course level not found!');

                    if (!courseTag) {
                        throw new Error('Course tag not found!');
                    }

                    const data: CreateCourseDto = {
                        courseLanguageId: courseLanguage.id,
                        description: course.course_description,
                        title: course.course_title,
                        isFree: course.course_price === 'Free',
                        price:
                            course.course_price === 'Free'
                                ? 0
                                : Number.parseInt(course.course_price),
                        learningOutcome: course.course_outcome,
                        levelId: courseLevel.id,
                        requirement: course.course_requirement,
                        slug,
                        instructionVideoId: instructionVideo.id,
                        isPublished: false,
                        lessons: [],
                        isValid: false,
                        warnings: null,
                        tagIds: [courseTag.id],
                        courseType: CourseType.FREE,
                    };

                    const _courseCreated = await this.create(
                        subdomainId,
                        userId,
                        data
                    );

                    _courseCreated.sections = [];

                    await Promise.all(
                        course._sections.map(async (section, index) => {
                            const sectionCreated: any =
                                await this.sectionsService.create(userId, {
                                    courseId: _courseCreated.id,
                                    index,
                                    title: section.section_title,
                                });

                            const lessons = await Promise.all(
                                section._lessons.map(async (lesson, index) => {
                                    const lessonCreated =
                                        await this.lessonsService.create(
                                            subdomainId,
                                            userId,
                                            {
                                                courseSectionId:
                                                    sectionCreated.id,
                                                title: lesson.lesson_title,
                                                index: index,
                                            }
                                        );

                                    return lessonCreated;
                                })
                            );

                            sectionCreated.lessons = lessons;

                            _courseCreated.sections.push(sectionCreated);

                            return sectionCreated;
                        })
                    );

                    return _courseCreated;
                } catch (err) {
                    return {
                        ...course,
                        success: false,
                        error: err.message,
                    };
                }
            })
        );

        return coursesCreated;
    }

    async importCourseStep2(
        subdomainId: string,
        userId: string,
        file: Express.Multer.File,
        courseId: number
    ) {
        if (!file) {
            throw new BadRequestException('File not found!');
        }

        const csvString = file.buffer.toString('utf8');
        const jsonData = await csvToJson().fromString(csvString);

        const step2DataConverted = jsonCourseDataConvertStep2(jsonData);

        const course = await this.prisma.course.findFirst({
            where: {
                id: courseId,
            },
        });
        if (!course) {
            throw new NotFoundException('Course not found!');
        }

        const sectionUpdated = await Promise.all(
            step2DataConverted.map(async (section) => {
                try {
                    const sectionFind =
                        await this.prisma.courseSection.findFirst({
                            where: {
                                title: section.course_section,
                                courseId: courseId,
                            },
                        });

                    if (!sectionFind) {
                        throw new Error('Section not found!');
                    }

                    const lessons = await Promise.all(
                        section._lessons.map(async (lesson) => {
                            // lesson update
                            const [lessonFind, introductionVideo] =
                                await Promise.all([
                                    this.prisma.lesson.findFirst({
                                        where: {
                                            title: lesson.lesson_title,
                                            courseSectionId: sectionFind.id,
                                        },
                                    }),
                                    this.filesService.addExternalFile(userId, {
                                        name:
                                            slugify(lesson.lesson_title) +
                                            '-instructionVideo-' +
                                            cuid(),
                                        link: lesson.lesson_video_url,
                                    }),
                                ]);

                            if (!lessonFind) {
                                throw new Error(
                                    `Lesson ${lesson.lesson_title} not found!'`
                                );
                            }

                            const lessonUpdated =
                                await this.lessonsService.update(
                                    lessonFind.id,
                                    {
                                        title: lesson.lesson_title,
                                        introduction:
                                            lesson.lesson_introduction,
                                        instructionVideoId:
                                            introductionVideo.id,
                                    }
                                );

                            const dialogsCreated = await Promise.all(
                                lesson._dialogs.map(async (dialog) => {
                                    const dialogCreated =
                                        await this.dialogsService.create({
                                            context: `<p>${dialog.dialogue_context}</p>`,
                                            lessonId: lessonFind.id,
                                            medias: [], // to pass medias,
                                            lines: [], // to pass lines,
                                        });

                                    const dialogLinesCreated =
                                        await Promise.all(
                                            dialog._lines.map(
                                                async (line, index) => {
                                                    const character =
                                                        await this.prisma.dialogCharacter.findFirst(
                                                            {
                                                                where: {
                                                                    name: line.character_name,
                                                                    subdomainId,
                                                                },
                                                            }
                                                        );

                                                    if (!character) {
                                                        throw new Error(
                                                            'Character not found!'
                                                        );
                                                    }

                                                    const dialogLineMedia =
                                                        await this.filesService.addExternalFile(
                                                            userId,
                                                            {
                                                                name:
                                                                    slugify(
                                                                        lesson.lesson_title
                                                                    ) +
                                                                    '-dialogLineAudio-' +
                                                                    cuid(),
                                                                link: line.dialogue_audio_url,
                                                            }
                                                        );

                                                    const lineCreated =
                                                        await this.dialogLinesService.create(
                                                            {
                                                                dialogId:
                                                                    dialogCreated.id,
                                                                index,
                                                                characterId:
                                                                    character.id,
                                                                content:
                                                                    line.dialogue_text,
                                                                medias: [
                                                                    dialogLineMedia.id,
                                                                ],
                                                            }
                                                        );

                                                    return lineCreated;
                                                }
                                            )
                                        );

                                    (dialogCreated as any).lines =
                                        dialogLinesCreated;

                                    return dialogCreated;
                                })
                            );

                            (lessonUpdated as any).dialogs = dialogsCreated;

                            return lessonUpdated;
                        })
                    );

                    return {
                        lessons,
                        title: section.course_section,
                    };
                } catch (err) {
                    return {
                        ...section,
                        success: false,
                        error: err.message,
                    };
                }
            })
        );

        return {
            sections: sectionUpdated,
        };
    }
}
