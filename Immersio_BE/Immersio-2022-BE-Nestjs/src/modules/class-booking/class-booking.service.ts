import {BadRequestException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import {BookingConfirmation,
    BookingStatus,
    ClassBooking,
    Prisma,
    Role,} from '@prisma/client';
import { SearchParamsDto, SearchParamsOnlyDto } from 'src/common/dto';
import { generateClassId } from 'src/helpers/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassBookingDto } from './dto/create-class-booking.dto';
import { UpdateClassBookingDto } from './dto/update-class-booking.dto';
import { RoleManagementService } from '../role-management/role-management.service';
import { SubmitBookingRequestDto } from './dto/submit-booking-request.dto';
import { GetClassesTimeDto } from './dto/get-classes-time.dto';
import { NotificationsService } from '../notifications/notifications.service';
import * as moment from 'moment';
import { GetBookingRequestsTutorDto } from './dto/get-booking-requests-tutor.dto';
import { SubmitLessonCompleteDto } from './dto/lesson-complete.dto';
import { ClassSessionReportService } from '../class-session-report/class-session-report.service';
import { CreateClassSessionReportDto } from '../class-session-report/dto/create-class-session-report.dto';

export type StudentChargeRateHourType = {
    hourRate: number;
    studentNumber: number;
};

@Injectable()
export class ClassBookingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly roleManagementService: RoleManagementService,
        private readonly notificationServices: NotificationsService,
        private readonly classSessionReportService: ClassSessionReportService
    ) {}

    async create(
        userId: string,
        role: Role,
        createClassBookingDto: CreateClassBookingDto
    ) {
        /**
         * Check if plan exists
         */
        const plan = await this.prisma.plan.findUnique({
            where: {
                id: createClassBookingDto.planId,
            },
        });
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }

        /**
         * Check if student exists
         */
        const studentsCount = await this.prisma.student.count({
            where: {
                id: {
                    in: createClassBookingDto.studentIds,
                },
            },
        });
        if (studentsCount !== createClassBookingDto.studentIds.length) {
            throw new NotFoundException('Students not found');
        }

        /**
         * Check if tutor exists
         */
        const tutorExists = await this.prisma.tutor.findFirst({
            where: {
                id: createClassBookingDto.tutorId,
            },
        });
        if (!tutorExists) {
            throw new NotFoundException('Tutors not found');
        }

        /**
         * Check if campus exists
         */
        if (createClassBookingDto.campusId) {
            const campus = await this.prisma.campus.findUnique({
                where: {
                    id: createClassBookingDto.campusId,
                },
            });
            if (!campus) {
                throw new NotFoundException('Campus not found');
            }
        }

        /**
         * Check if room exists
         */
        if (createClassBookingDto.roomId) {
            const room = await this.prisma.room.findUnique({
                where: {
                    id: createClassBookingDto.roomId,
                },
            });
            if (!room) {
                throw new NotFoundException('Room not found');
            }
        }

        /**
         * Generate class id
         */
        const latestId = await this.prisma.classBooking.findFirst({
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
            },
        });
        const newClassId = generateClassId(latestId ? latestId.id : 0);

        /**
         * Map student charge rate hour
         */
        const studentChargeRateHour =
            createClassBookingDto.studentChargeRateHour;

        /**
         * Create class
         */
        const classBooking = await this.prisma.classBooking.create({
            data: {
                bookingId: newClassId,
                finishTime: createClassBookingDto.finishTime,
                startTime: createClassBookingDto.startTime,
                isPublic: createClassBookingDto.isPublic,
                topic: createClassBookingDto.topic,
                campusId: createClassBookingDto.campusId,
                roomId: createClassBookingDto.roomId,
                timezoneAbbr: createClassBookingDto.timezoneAbbr,
                studentChargeRateHour,
                tutorChargeRateHour: createClassBookingDto.tutorChargeRateHour,
                maxStudents: createClassBookingDto.maxStudents,
                isRepeat: createClassBookingDto.isRepeat,
                planId: createClassBookingDto.planId,
                studentPremiumAmount:
                    createClassBookingDto.studentPremiumAmount,
                virtualClassLink: createClassBookingDto.virtualClassLink,
                repeatData: createClassBookingDto.repeatData,
                repeatType: createClassBookingDto.repeatType,
                repeatUntilDate: createClassBookingDto.repeatUntilDate,
                students: {
                    connect: createClassBookingDto.studentIds.map((id) => ({
                        id,
                    })),
                },
                createdByUserId: userId,
                tutorId: createClassBookingDto.tutorId,
            },
        });

        return classBooking;
    }

    async getClasses(
        userId: string,
        role: Role,
        subdomainId: string,
        search: SearchParamsDto
    ) {
        const select = {
            id: true,
            topic: true,
            isPublic: true,
            isRepeat: true,
            campusId: true,
            bookingId: true,
            roomId: true,
            startTime: true,
            finishTime: true,
            timezoneAbbr: true,
            studentChargeRateHour: true,
            tutorChargeRateHour: true,
            maxStudents: true,
            studentPremiumAmount: true,
            virtualClassLink: true,
            status: true,
            confirmation: true,
            repeatData: true,
            repeatType: true,
            repeatUntilDate: true,
            students: {
                select: {
                    id: true,
                    profile: true,
                },
            },
            tutor: {
                select: {
                    id: true,
                    profile: true,
                    hourRate: true,
                    amountPaid: true,
                    title: true,
                    bio: true,
                    website: true,
                    countryCode: true,
                    experienceDesc: true,
                    qualificationDesc: true,
                    relatedMaterialDesc: true,
                    proficiencyLevelCode: true,
                    updatedAt: true,
                    createdAt: true,
                    teachLanguages: true,
                    languagesSpoken: true,
                    country: true,
                    proficiencyLevel: true,
                    reviews: true,
                },
            },
            plan: true,
        };

        const pagination = {
            orderBy: search.sortBy
                ? {
                    [search.sortBy]: search.sortDesc ? 'desc' : 'asc',
                }
                : undefined,
            take: search.take,
            skip: search.skip,
        };

        let where: Prisma.ClassBookingWhereInput = {
        };

        let classBookingIdRequest: number | null = null; // Can be null, studentId or tutorId

        /**
         * Get student role
         */
        if (role === 'STUDENT') {
            const studentUser = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    profile: {
                        select: {
                            student: true,
                        },
                    },
                },
            });
            if (!studentUser) {
                throw new NotFoundException('Student not found');
            }

            where = {
                students: {
                    some: {
                        id: studentUser.profile.student.id,
                    },
                },
            };

            classBookingIdRequest = studentUser.profile.student.id;
        }

        /**
         *
         * Get tutor role
         * */
        if (role === 'TUTOR') {
            const tutor = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    profile: {
                        select: {
                            tutor: true,
                        },
                    },
                },
            });
            if (!tutor) {
                throw new NotFoundException('Tutor not found');
            }

            where = {
                tutorId: tutor.profile.tutor.id,
            };

            classBookingIdRequest = tutor.profile.tutor.id;
        }

        /**
         * Get instructor, subdomain admin role
         */
        if (role === 'INSTRUCTOR') {
            const instructor = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    profile: {
                        select: {
                            instructor: true,
                        },
                    },
                },
            });

            where = {
                plan: {
                    instructorId: instructor.profile.instructor.id,
                },
            };
        }

        /**
         * Get admin role
         */
        if (role === 'SUBDOMAIN_ADMIN') {
            where = {
                plan: {
                    subdomainId,
                },
            };
        }

        const [total, classes] = await Promise.all([
            this.prisma.classBooking.count({
                where,
            }),
            this.prisma.classBooking.findMany({
                where,
                select,
                ...pagination,
            }),
        ]);

        // Check if there are class booking requests and student
        if (classBookingIdRequest) {
            const classIds = classes.map((cl) => cl.id);

            const classBookingRequests =
                await this.prisma.classBookingRequest.findMany({
                    where: {
                        classBookingId: {
                            in: classIds,
                        },
                    },
                });

            const results = classes.map((cl) => {
                const request = classBookingRequests.filter(
                    (req) => req.classBookingId === cl.id
                );

                return {
                    ...cl,
                    confirmation:
                        classBookingRequests.find(
                            (req) =>
                                req.classBookingId === cl.id &&
                                (req.studentId === classBookingIdRequest ||
                                    req.tutorId === classBookingIdRequest)
                        )?.status || null,
                    spaceAvailable:
                        cl.maxStudents - request.length > 0
                            ? cl.maxStudents - request.length
                            : 0,
                };
            });

            return {
                total,
                data: results,
            };
        }

        return {
            total,
            data: classes,
        };
    }

    async updateClass(
        id: number,
        role: Role,
        userId: string,
        updateClassBookingDto: UpdateClassBookingDto
    ) {
        let whereClause: Prisma.ClassBookingWhereUniqueInput = {
            id,
        };

        if (role === 'INSTRUCTOR' || role === 'TUTOR') {
            whereClause = {
                id,
                createdByUserId: userId,
            };
        }

        const classBooking = await this.prisma.classBooking.findUnique({
            where: whereClause,
        });

        if (!classBooking) {
            throw new NotFoundException('Class booking not found');
        }

        /**
         * Map student charge rate hour
         */
        const studentChargeRateHour =
            updateClassBookingDto.studentChargeRateHour
                ? updateClassBookingDto.studentChargeRateHour
                : undefined;

        return this.prisma.classBooking.update({
            where: {
                id,
            },
            data: {
                finishTime: updateClassBookingDto.finishTime,
                startTime: updateClassBookingDto.startTime,
                isPublic: updateClassBookingDto.isPublic,
                topic: updateClassBookingDto.topic,
                campusId: updateClassBookingDto.campusId,
                roomId: updateClassBookingDto.roomId,
                timezoneAbbr: updateClassBookingDto.timezoneAbbr,
                studentChargeRateHour,
                tutorChargeRateHour: updateClassBookingDto.tutorChargeRateHour,
                maxStudents: updateClassBookingDto.maxStudents,
                isRepeat: updateClassBookingDto.isRepeat,
                planId: updateClassBookingDto.planId,
                studentPremiumAmount:
                    updateClassBookingDto.studentPremiumAmount,
                virtualClassLink: updateClassBookingDto.virtualClassLink,
                repeatData: updateClassBookingDto.repeatData,
                repeatType: updateClassBookingDto.repeatType,
                repeatUntilDate: updateClassBookingDto.repeatUntilDate,
                students: updateClassBookingDto.studentIds
                    ? {
                        set: updateClassBookingDto.studentIds.map((id) => ({
                            id,
                        })),
                    }
                    : undefined,
                tutorId: updateClassBookingDto.tutorId,
            },
        });
    }

    async deleteClass(id: number, role: Role, userId: string) {
        let whereClause: Prisma.ClassBookingWhereUniqueInput = {
            id,
        };

        if (role === 'INSTRUCTOR' || role === 'TUTOR') {
            whereClause = {
                id,
                createdByUserId: userId,
            };
        }

        const classBooking = await this.prisma.classBooking.findUnique({
            where: whereClause,
        });

        if (!classBooking) {
            throw new NotFoundException('Class booking not found');
        }

        return this.prisma.classBooking.delete({
            where: {
                id,
            },
        });
    }

    async getDetailClass(id: number) {
        // TODO implement permissions later

        const classBooking = await this.prisma.classBooking.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                topic: true,
                isPublic: true,
                isRepeat: true,
                campusId: true,
                bookingId: true,
                startTime: true,
                finishTime: true,
                timezoneAbbr: true,
                studentChargeRateHour: true,
                tutorChargeRateHour: true,
                maxStudents: true,
                studentPremiumAmount: true,
                virtualClassLink: true,
                status: true,
                confirmation: true,
                students: {
                    select: {
                        id: true,
                        profile: true,
                    },
                },
                tutorId: true,
                campus: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                planId: true,
                createdAt: true,
                updatedAt: true,
                repeatData: true,
                repeatType: true,
                repeatUntilDate: true,
                roomId: true,
            },
        });

        if (!classBooking) {
            throw new NotFoundException('Class booking not found');
        }

        return classBooking;
    }

    async submitBookingRequest(userId: string, data: SubmitBookingRequestDto) {
        // Check if class booking exists
        const classBooking = await this.prisma.classBooking.findUnique({
            where: {
                id: data.classBookingId,
            },
        });
        if (!classBooking) {
            throw new NotFoundException('Class booking not found');
        }

        // Check if student exists
        const student = await this.prisma.student.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
            select: {
                id: true,
                profile: true,
            },
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }

        // Check if tutor exists
        const tutor = await this.prisma.tutor.findFirst({
            where: {
                id: data.tutorId,
            },
            select: {
                id: true,
                profile: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
            },
        });
        if (!tutor) {
            throw new NotFoundException('Tutor not found');
        }

        // Check if request already exist
        const checkSubmitExist =
            await this.prisma.classBookingRequest.findFirst({
                where: {
                    studentId: student.id,
                    classBookingId: classBooking.id,
                    tutorId: data.tutorId,
                },
            });
        if (checkSubmitExist) {
            throw new BadRequestException('Request already exist');
        }

        // Create request
        const bookingRequest = await this.prisma.classBookingRequest.create({
            data: {
                studentId: student.id,
                classBookingId: classBooking.id,
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                trialSession: data.trialSession,
                tutorId: data.tutorId,
                aboutStudent: data.aboutStudent,
            },
        });

        // Send notification
        await this.notificationServices.create(tutor.profile.userId, {
            type: 'SUBMIT_BOOKING_REQUEST',
            body: 'You have a new booking request',
            title: 'New booking request',
            metadata: {
                classBookingId: classBooking.id,
                bookingRequestId: bookingRequest.id,
                student,
            },
        });

        return bookingRequest;
    }

    async acceptBookingRequest(userId: string, requestId: number) {
        const tutor = await this.prisma.tutor.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
        });
        if (!tutor) {
            throw new NotFoundException('Tutor not found');
        }

        // Check if request exists
        const bookingRequest = await this.prisma.classBookingRequest.findFirst({
            where: {
                id: requestId,
                tutorId: tutor.id,
            },
        });
        if (!bookingRequest) {
            throw new NotFoundException('Booking request not found');
        }

        // Check if request already rejected or confirmed
        if (
            bookingRequest.status === 'REJECTED' ||
            bookingRequest.status === 'CONFIRMED'
        ) {
            throw new BadRequestException(
                'Status booking cannot be changed anymore'
            );
        }

        // Update request
        const request = await this.prisma.classBookingRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: 'CONFIRMED',
            },
        });

        return request;
    }

    async rejectBookingRequest(userId: string, requestId: number) {
        const tutor = await this.prisma.tutor.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
        });
        if (!tutor) {
            throw new NotFoundException('Tutor not found');
        }

        // Check if request exists
        const bookingRequest = await this.prisma.classBookingRequest.findFirst({
            where: {
                id: requestId,
                tutorId: tutor.id,
            },
        });
        if (!bookingRequest) {
            throw new NotFoundException('Booking request not found');
        }

        // Check if request already rejected or confirmed
        if (
            bookingRequest.status === 'REJECTED' ||
            bookingRequest.status === 'CONFIRMED'
        ) {
            throw new BadRequestException(
                'Status booking cannot be changed anymore'
            );
        }

        // Update request
        const request = await this.prisma.classBookingRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: 'REJECTED',
            },
        });

        return request;
    }

    async getTutorsOfStudents(userId: string, search: SearchParamsOnlyDto) {
        const { searchBy, searchKey } = search;

        const student = await this.prisma.student.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        const studentId = student.id;

        const tutorsWithClass = await this.prisma.classBooking.findMany({
            where: {
                students: {
                    some: {
                        id: studentId,
                    },
                },
            },
            select: {
                tutor: {
                    where: {
                        teachLanguages:
                            searchBy === 'teachLanguages'
                                ? {
                                    some: {
                                        code: searchKey,
                                    },
                                }
                                : undefined,
                        countryCode:
                            searchBy === 'countryCode' ? searchKey : undefined,
                        classBookings:
                            searchBy === 'startTime'
                                ? {
                                    some: {
                                        startTime: {
                                            gte: moment(searchKey)
                                                .startOf('day')
                                                .toISOString(),

                                            lte: moment(searchKey)
                                                .endOf('day')
                                                .toISOString(),
                                        },
                                    },
                                }
                                : (undefined as any),
                    },
                    select: {
                        id: true,
                        profile: true,
                        hourRate: true,
                        amountPaid: true,
                        title: true,
                        bio: true,
                        website: true,
                        countryCode: true,
                        experienceDesc: true,
                        qualificationDesc: true,
                        relatedMaterialDesc: true,
                        proficiencyLevelCode: true,
                        updatedAt: true,
                        createdAt: true,
                        teachLanguages: true,
                        languagesSpoken: true,
                        country: true,
                        proficiencyLevel: true,
                        reviews: true,
                    },
                },
            },
        });

        const tutors = tutorsWithClass.flatMap((obj) => obj.tutor);

        return tutors;
    }

    // Get classes of tutors students can view
    async getClassesOfTutors(userId: string, tutorId: number) {
        // Check if student exists
        const student = await this.prisma.student.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        const studentId = student.id;

        // Check if tutor exists
        const tutor = await this.prisma.tutor.findFirst({
            where: {
                id: tutorId,
            },
        });
        if (!tutor) {
            throw new NotFoundException('Tutor not found');
        }

        // Get class booking requests and classes
        const [classBookingRequests, classes] = await Promise.all([
            this.prisma.classBookingRequest.findMany({
                where: {
                    tutorId,
                },
            }),
            this.prisma.classBooking.findMany({
                where: {
                    tutorId,
                    students: {
                        some: {
                            id: studentId,
                        },
                    },
                },
                select: {
                    id: true,
                    topic: true,
                    isPublic: true,
                    isRepeat: true,
                    campusId: true,
                    bookingId: true,
                    startTime: true,
                    finishTime: true,
                    timezoneAbbr: true,
                    studentChargeRateHour: true,
                    tutorChargeRateHour: true,
                    maxStudents: true,
                    studentPremiumAmount: true,
                    virtualClassLink: true,
                    status: true,
                    confirmation: true,
                    plan: true,
                    campus: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    repeatData: true,
                    repeatType: true,
                    repeatUntilDate: true,
                    roomId: true,
                },
            }),
        ]);

        // Get confirmation and space available
        const results = classes.map((cl) => {
            const request = classBookingRequests.filter(
                (req) => req.classBookingId === cl.id
            );

            return {
                ...cl,
                confirmation:
                    classBookingRequests.find(
                        (req) =>
                            req.classBookingId === cl.id &&
                            req.studentId === studentId
                    )?.status || null,
                spaceAvailable:
                    cl.maxStudents - request.length > 0
                        ? cl.maxStudents - request.length
                        : 0,
            };
        });

        return results;
    }

    async studentGetClassesTime(userId: string, search: GetClassesTimeDto) {
        // Check if student exists
        const student = await this.prisma.student.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
        });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        const studentId = student.id;

        const startDate = moment(search.startDate).toISOString();
        const endDate = moment(search.endDate).toISOString();

        // Get class booking and class booking requests
        const whereClause: Prisma.ClassBookingWhereInput = {
            students: {
                some: {
                    id: studentId,
                },
            },
            classBookingRequests: {
                some: {
                    studentId,
                    status: 'CONFIRMED',
                },
            },
            startTime: {
                gte: startDate,
            },
            finishTime: {
                lte: endDate,
            },
            // search by tutor
            tutorId: search.tutorId ? search.tutorId : undefined,
            // search by class status
            confirmation: search.classStatus
                ? {
                    in: search.classStatus as BookingConfirmation[],
                }
                : undefined,
            // search by campus
            campusId: search.campusIds
                ? {
                    in: search.campusIds,
                }
                : undefined,
        };

        const [classes, classWithAllRequests] = await Promise.all([
            this.prisma.classBooking.findMany({
                where: whereClause,
                select: {
                    id: true,
                    topic: true,
                    isPublic: true,
                    isRepeat: true,
                    campusId: true,
                    bookingId: true,
                    startTime: true,
                    finishTime: true,
                    timezoneAbbr: true,
                    studentChargeRateHour: true,
                    tutorChargeRateHour: true,
                    maxStudents: true,
                    studentPremiumAmount: true,
                    virtualClassLink: true,
                    status: true,
                    confirmation: true,
                    plan: true,
                    campus: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    repeatData: true,
                    repeatType: true,
                    repeatUntilDate: true,
                    classBookingRequests: {
                        select: {
                            id: true,
                            tutor: {
                                select: {
                                    id: true,
                                    profile: true,
                                    hourRate: true,
                                    amountPaid: true,
                                    title: true,
                                    bio: true,
                                    website: true,
                                    countryCode: true,
                                    experienceDesc: true,
                                    qualificationDesc: true,
                                    relatedMaterialDesc: true,
                                    proficiencyLevelCode: true,
                                    updatedAt: true,
                                    createdAt: true,
                                    teachLanguages: true,
                                    languagesSpoken: true,
                                    country: true,
                                    proficiencyLevel: true,
                                    reviews: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.classBooking.findMany({
                where: whereClause,
                select: {
                    id: true,
                    classBookingRequests: true,
                },
            }),
        ]);

        const results = classes.map((cl) => {
            const request = classWithAllRequests
                .filter((req) => req.id === cl.id)
                .map((req) => req.classBookingRequests);

            return {
                ...cl,
                confirmation: BookingConfirmation.CONFIRMED,
                classBookingRequests: cl.classBookingRequests?.[0] ?? null,
                spaceAvailable:
                    cl.maxStudents - request.length > 0
                        ? cl.maxStudents - request.length
                        : 0,
            };
        });

        return results;
    }

    async tutorGetClassTime(userId: string, search: GetClassesTimeDto) {
        // Check if tutor exists
        const tutor = await this.prisma.tutor.findFirst({
            where: {
                profile: {
                    userId,
                },
            },
        });
        if (!tutor) {
            throw new NotFoundException('Tutor not found');
        }
        const tutorId = tutor.id;

        const startDate = moment(search.startDate).toISOString();
        const endDate = moment(search.endDate).toISOString();

        // Get class booking and class booking requests
        const whereClause: Prisma.ClassBookingWhereInput = {
            tutorId,
            classBookingRequests: {
                some: {
                    tutorId,
                    status: 'CONFIRMED',
                },
            },
            startTime: {
                gte: startDate,
            },
            finishTime: {
                lte: endDate,
            },
            confirmation: search.classStatus
                ? {
                    in: search.classStatus as BookingConfirmation[],
                }
                : undefined,
            // search by campus
            campusId: search.campusIds
                ? {
                    in: search.campusIds,
                }
                : undefined,
        };

        const [classes, classWithAllRequests] = await Promise.all([
            this.prisma.classBooking.findMany({
                where: whereClause,
                select: {
                    id: true,
                    topic: true,
                    isPublic: true,
                    isRepeat: true,
                    campusId: true,
                    bookingId: true,
                    startTime: true,
                    finishTime: true,
                    timezoneAbbr: true,
                    studentChargeRateHour: true,
                    tutorChargeRateHour: true,
                    maxStudents: true,
                    studentPremiumAmount: true,
                    virtualClassLink: true,
                    status: true,
                    confirmation: true,
                    plan: true,
                    campus: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    repeatData: true,
                    repeatType: true,
                    repeatUntilDate: true,
                    classBookingRequests: {
                        select: {
                            id: true,
                            tutor: {
                                select: {
                                    id: true,
                                    profile: true,
                                    hourRate: true,
                                    amountPaid: true,
                                    title: true,
                                    bio: true,
                                    website: true,
                                    countryCode: true,
                                    experienceDesc: true,
                                    qualificationDesc: true,
                                    relatedMaterialDesc: true,
                                    proficiencyLevelCode: true,
                                    updatedAt: true,
                                    createdAt: true,
                                    teachLanguages: true,
                                    languagesSpoken: true,
                                    country: true,
                                    proficiencyLevel: true,
                                    reviews: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.classBooking.findMany({
                where: whereClause,
                select: {
                    id: true,
                    classBookingRequests: true,
                },
            }),
        ]);

        const results = classes.map((cl) => {
            const request = classWithAllRequests
                .filter((req) => req.id === cl.id)
                .map((req) => req.classBookingRequests);

            return {
                ...cl,
                confirmation: BookingConfirmation.CONFIRMED,
                spaceAvailable:
                    cl.maxStudents - request.length > 0
                        ? cl.maxStudents - request.length
                        : 0,
            };
        });

        return results;
    }

    async getDetailBookingRequest(userId: string, requestId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                profile: {
                    select: {
                        tutorId: true,
                        studentId: true,
                    },
                },
            },
        });

        // Check if booking request exists
        const bookingRequest = await this.prisma.classBookingRequest.findFirst({
            where: {
                id: requestId,
                studentId: user.profile.studentId
                    ? user.profile.studentId
                    : undefined,
                tutorId: user.profile.tutorId
                    ? user.profile.tutorId
                    : undefined,
            },
        });
        if (!bookingRequest) {
            throw new NotFoundException('Booking request not found');
        }

        return bookingRequest;
    }

    async getDetailBookingRequestForTutor(
        userId: string,
        query: GetBookingRequestsTutorDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
                profile: {
                    tutorId: {
                        not: null,
                    },
                },
            },
            select: {
                id: true,
                profile: {
                    select: {
                        tutorId: true,
                    },
                },
            },
        });

        const whereClause: Prisma.ClassBookingRequestWhereInput = {
            tutorId: user.profile.tutorId,
            status: query.onlyConfirmed ? 'CONFIRMED' : undefined,
            email: query.searchBy === 'email' ? query.searchKey : undefined,
            phoneNumber:
                query.searchBy === 'phoneNumber' ? query.searchKey : undefined,
        };

        const bookingRequests = await this.prisma.classBookingRequest.findMany({
            where: whereClause,
            orderBy: query.sortBy && {
                [query.sortBy]: query.sortDesc ? 'desc' : 'asc',
            },
            take: query.take,
            skip: query.skip,
            select: {
                aboutStudent: true,
                classBooking: true,
                email: true,
                id: true,
                name: true,
                phoneNumber: true,
                status: true,
                student: true,
                trialSession: true,
            },
        });

        const total = await this.prisma.classBookingRequest.count({
            where: whereClause,
        });

        return {
            data: bookingRequests,
            total,
        };
    }

    async submitLessonComplete(
        subdomainId: string,
        userId: string,
        data: SubmitLessonCompleteDto
    ) {
        // Check if class booking exists
        const classBooking = await this.prisma.classBooking.findFirst({
            where: {
                id: data.classId,
                tutor: {
                    profile: {
                        userId,
                    },
                },
            },
        });

        // Check if completed
        const completed = await this.isLessonCompleted(
            data.classId,
            data.lessonId
        );
        if (completed) {
            throw new BadRequestException('Lesson already completed');
        }

        // Class booking does not exist
        if (!classBooking) {
            throw new NotFoundException('Class booking not found');
        }

        // Check class booking status is confirmed
        if (classBooking.confirmation !== 'CONFIRMED') {
            throw new BadRequestException('Class booking is not confirmed');
        }

        // Create lesson complete
        await this.prisma.classLessonComplete.create({
            data: {
                lessonId: data.lessonId,
                classBookingId: data.classId,
                userId,
            },
        });

        // TODO: (Boi) Clarify this with Trien because lesson complete for each lesson, but report for class
        // // Get credit cost
        // const creditCost = await this._getCreditCost(classBooking);

        // // Generate report class
        // const dataSessionReport: CreateClassSessionReportDto = {
        //     classBookingId: data.classId,
        //     creditCost,
        //     startTime: classBooking.startTime,
        //     finishTime: classBooking.finishTime,
        // };
        // await this.classSessionReportService.create(
        //     subdomainId,
        //     dataSessionReport
        // );

        return true;
    }

    private async _getCreditCost(classBooking: ClassBooking) {
        const bookingRequest = await this.prisma.classBookingRequest.findMany({
            where: {
                classBookingId: classBooking.id,
                status: 'CONFIRMED',
            },
        });

        const totalStudents = bookingRequest.length;

        const studentChargeRateHour = classBooking.studentChargeRateHour;

        // Get student charge rate hour by total students
        const totalCharge = totalStudents * studentChargeRateHour;

        return totalCharge;
    }

    async isLessonCompleted(classId: number, lessonId: number) {
        const completed = await this.prisma.classLessonComplete.findFirst({
            where: {
                classBookingId: classId,
                lessonId,
            },
        });
        return completed ? true : false;
    }

    async getLessonsCompleted(classId: number) {
        const completed = await this.prisma.classLessonComplete.findMany({
            where: {
                classBookingId: classId,
            },
        });

        return completed;
    }
}
