import {BadGatewayException,
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,} from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { SearchParamsDto } from 'src/common/dto';
import {roleManagementDefaultValue,
    userSocialLinks,} from 'src/config/initialization';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserSocialDto } from './dto/update-user-social.dto';
import * as moment from 'moment';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { SendEmailHelper } from 'src/helpers/send-email';
import { ConfigService } from '@nestjs/config';
import CreateInstructorDto from './dto/create-instructor.dto';
import CreateTutorDto from './dto/create-tutor.dto';
import CreateStudentDto from './dto/create-student.dto';
import CreateCustomerServiceDto from './dto/create-customer-service.dto';
import CreateEditorDto from './dto/create-editor.dto';
import UpdateInstructorDto from './dto/update-instructor.dto';
import UpdateTutorDto from './dto/update-tutor.dto';
import UpdateStudentDto from './dto/update-student.dto';
import UpdateCustomerServiceDto from './dto/update-customer-service.dto';
import UpdateEditorDto from './dto/update-editor.dto';
import { InviteInterviewDto } from './dto/invite-interview.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { getSubdomainUrl } from 'src/helpers/common';
import * as csv from 'csvtojson';
import { customAlphabet } from 'nanoid';
import { CreateClassTagDto } from './dto/create-class-tag.dto';
import { UpdateClassTagDto } from './dto/update-class-tag.dto';
import * as csvToJson from 'csvtojson';
import { ImportInstructorsDto } from './dto/import-instructor.dto';
import { TimeZoneService } from '../time-zones/time-zone.service';
import { ImportTutorsDto } from './dto/import-tutors.dto';
import { ImportStudentsDto } from './dto/import-students.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class RoleManagementService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly notificationService: NotificationsService,
        private readonly timeZoneService: TimeZoneService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async initNewRoleManagement(subdomainId: string) {
        const roleExist = await this.prisma.roleManagement.findFirst({
            where: {
                subdomainId: subdomainId,
            },
        });

        if (roleExist) {
            return false;
        }

        await this.prisma.roleManagement.createMany({
            data: Object.keys(roleManagementDefaultValue).map((role) => ({
                name: roleManagementDefaultValue[role]['name'],
                role: role,
                subdomainId,
                value: JSON.stringify(
                    roleManagementDefaultValue[role]['value']
                ),
            })) as any,
        });
    }

    async findAll(subdomainId: string) {
        const result = await this.prisma.roleManagement.findMany({
            where: {
                subdomainId: subdomainId,
            },
        });

        if (!result || result.length === 0) {
            // init new role management if not exist
            await this.initNewRoleManagement(subdomainId);

            // call again
            return this.findAll(subdomainId);
        }

        return result.map((e) => {
            delete e.subdomainId;
            e.value = JSON.parse(e.value);
            return e;
        });
    }

    async findOne(id: string, subdomainId: string) {
        const result = await this.prisma.roleManagement.findFirst({
            where: {
                id,
                subdomainId: subdomainId,
            },
        });
        delete result.subdomainId;
        result.value = JSON.parse(result.value);
        return result;
    }

    async findWithRole(role: Role, subdomainId: string) {
        const result = await this.db.selectFrom('RoleManagement')
            .where('role', '=', role)
            .where('subdomainId', '=', subdomainId)
            .selectAll()
            .executeTakeFirst();
        if (result) {
            delete result.subdomainId;
            result.value = JSON.parse(result.value);
            return result;
        }
        return null;
    }

    async update(id: string, value: object) {
        try {
            const currentRole = await this.prisma.roleManagement.findFirst({
                where: {
                    id,
                },
            });

            const isMatchRoleValue = Object.keys(value).every((access) => {
                const objectValue: object =
                    roleManagementDefaultValue[currentRole.role].value;

                if (access in objectValue) {
                    return true;
                } else {
                    return false;
                }
            });

            if (!isMatchRoleValue)
                throw new BadRequestException('Access role does not exits');

            const currentValue = JSON.parse(currentRole.value);
            const newValue = roleManagementDefaultValue[currentRole.role].value;
            Object.keys(newValue).forEach((v) => {
                newValue[v] =
                    value[v] != undefined
                        ? value[v]
                        : currentValue[v] !== undefined
                            ? currentValue[v]
                            : newValue[v];
            });

            await this.prisma.roleManagement.update({
                where: {
                    id,
                },
                data: {
                    value: JSON.stringify(newValue),
                },
            });
            return true;
        } catch {
            throw new BadGatewayException('Update role fail');
        }
    }

    async csv(subdomainId: string, file: Express.Multer.File) {
        csv()
            .fromString(file.buffer.toString())
            .then((rows) => {
                rows.forEach(async (row) => {
                    const password = customAlphabet('1234567890abcdef', 16);
                    switch (row.role) {
                    case 'instructor':
                        // await this.createInstructor()
                        break;
                    case 'tutor':
                        // await this.createTutor()
                        break;
                    case 'student':
                        // await this.createStudent()
                        break;
                        //...
                    default:
                        return false;
                    }
                    this._sendAccountInfoEmail(row.email, subdomainId, {
                        firstName: row['first-name'],
                        password,
                    });
                });
            });
        return true;
    }

    async getUsersOfRole(
        role: Role,
        subdomainId: string,
        filter: SearchParamsDto
    ) {
        const searchObject: any = {
        };
        if (filter.searchBy && filter.searchKey) {
            if (filter.searchBy === 'email') {
                searchObject[filter.searchBy] = {
                    contains: filter.searchKey,
                };
            } else if (
                filter.searchBy === 'firstName' ||
                filter.searchBy === 'lastName' ||
                filter.searchBy === 'phoneNumber'
            ) {
                searchObject.profile = {
                    [filter.searchBy]: {
                        contains: filter.searchKey,
                    },
                };
            } else if (filter.searchBy === 'isVerified') {
                searchObject[filter.searchBy] =
                    filter.searchKey === '0' || filter.searchKey === 'true'
                        ? true
                        : false;
            } else {
                throw new BadRequestException(
                    'searchBy must be email, firstName, lastName,  or phoneNumber'
                );
            }
        }

        const profileSelect: any = {
        };

        switch (role) {
        case Role.TUTOR:
            profileSelect.tutor = {
                select: {
                    id: true,
                    hourRate: true,
                    teachLanguages: true,
                },
            };
            break;
        case Role.INSTRUCTOR:
            profileSelect.instructor = {
                select: {
                    id: true,
                    teachLanguages: true,
                },
            };
            break;
        case Role.STUDENT:
            profileSelect.student = {
                select: {
                    id: true,
                    parentEmail: true,
                    parentDialCode: true,
                    parentPhoneNumber: true,
                },
            };
            break;

        case Role.CUSTOMER_SERVICE:
            profileSelect.customerService = {
                select: {
                    id: true,
                },
            };
            break;
        case Role.EDITOR:
            profileSelect.editor = {
                select: {
                    id: true,
                },
            };
            break;
        default:
            break;
        }

        const users = await this.prisma.user.findMany({
            where: {
                subdomainId,
                role,
                isDeleted: false,
                ...searchObject,
            },
            select: {
                id: true,
                email: true,
                isActive: true,
                isVerified: true,
                role: true,
                status: true,
                classTags: true,
                profile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        address: true,
                        avatarUrl: true,
                        dob: true,
                        gender: true,
                        socialLinks: true,
                        dialCode: true,
                        phoneNumber: true,
                        description: true,
                        ...profileSelect,
                    },
                },
            },
            skip: filter.skip,
            take: filter.take,
            orderBy: filter.sortBy
                ? {
                    [filter.sortBy]: filter.sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });

        const usersMap = users.map((u: any) => {
            if (u.profile)
                try {
                    u.profile.socialLinks = JSON.parse(u.profile.socialLinks);
                } catch {
                    u.profile.socialLinks = userSocialLinks as any;
                }
            return u;
        });

        const total = await this.prisma.user.count({
            where: {
                subdomainId,
                isDeleted: false,
                role,
                ...searchObject,
            },
        });

        return {
            users: usersMap,
            total,
        };
    }

    async setActiveUser(id: string, isActive: boolean) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (
            !user ||
            user.role === Role.SUPER_ADMIN ||
            user.role === Role.SUBDOMAIN_ADMIN
        )
            throw new BadRequestException();

        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                isActive,
            },
        });
        return true;
    }

    /*-------------------------------------------------------- INSTRUCTOR --------------------------------------------------------*/

    async createInstructor(body: CreateInstructorDto, subdomainId: string) {
        const roleProfile = {
            instructor: {
                create: {
                    hourRate: body.hourRate,
                    teachLanguages: {
                        connect: body?.teachLanguages.map((l) => ({
                            id: l,
                        })),
                    },
                    languagesSpoken: {
                        connect: body?.languageCodes.map((l) => ({
                            code: l,
                        })),
                    },
                    // proficiencyLevel: {
                    //     connect: {
                    //         code: body.proficiencyLevelCode,
                    //     },
                    // },
                    qualificationDesc: body.qualificationDesc,
                    experienceDesc: body.experienceDesc,
                    bio: body.bio,
                },
            },
        };

        try {
            const result = await this.createUser(
                body,
                subdomainId,
                roleProfile
            );
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateInstructor(userId: string, body: UpdateInstructorDto) {
        const roleProfile = {
            instructor: {
                update: {
                    hourRate: body.hourRate,
                    teachLanguages: {
                        set: body?.teachLanguages.map((l) => ({
                            id: l,
                        })),
                    },
                    languagesSpoken: {
                        set: body?.languageCodes.map((l) => ({
                            code: l,
                        })),
                    },
                    // proficiencyLevel: {
                    //     connect: {
                    //         code: body.proficiencyLevelCode,
                    //     },
                    // },
                    qualificationDesc: body.qualificationDesc,
                    experienceDesc: body.experienceDesc,
                    bio: body.bio,
                },
            },
        };

        try {
            const result = await this.updateUser(userId, body, roleProfile);
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    /*-------------------------------------------------------- TUTOR --------------------------------------------------------*/

    async createTutor(body: CreateTutorDto, subdomainId: string) {
        const roleProfile = {
            tutor: {
                create: {
                    hourRate: body.hourRate,
                    teachLanguages: {
                        connect: body?.teachLanguages.map((l) => ({
                            id: l,
                        })),
                    },
                    languagesSpoken: {
                        connect: body?.languageCodes.map((l) => ({
                            code: l,
                        })),
                    },
                    // proficiencyLevel: {
                    //     connect: {
                    //         code: body.proficiencyLevelCode,
                    //     },
                    // },
                    qualificationDesc: body.qualificationDesc,
                    experienceDesc: body.experienceDesc,
                    bio: body.bio,
                },
            },
        };

        try {
            const result = await this.createUser(
                body,
                subdomainId,
                roleProfile
            );
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateTutor(userId: string, body: UpdateTutorDto) {
        const roleProfile = {
            tutor: {
                update: {
                    hourRate: body.hourRate,
                    teachLanguages: {
                        set: body?.teachLanguages.map((l) => ({
                            id: l,
                        })),
                    },
                    languagesSpoken: {
                        set: body?.languageCodes.map((l) => ({
                            code: l,
                        })),
                    },
                    // proficiencyLevel: {
                    //     connect: {
                    //         code: body.proficiencyLevelCode,
                    //     },
                    // },
                    qualificationDesc: body.qualificationDesc,
                    experienceDesc: body.experienceDesc,
                    bio: body.bio,
                },
            },
        };

        try {
            const result = await this.updateUser(userId, body, roleProfile);
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    /*-------------------------------------------------------- STUDENT --------------------------------------------------------*/

    async createStudent(body: CreateStudentDto, subdomainId: string) {
        const roleProfile = {
            student: {
                create: {
                    languagesSpoken: {
                        connect: body?.languageCodes.map((l) => ({
                            code: l,
                        })),
                    },
                    learningLanguages: {
                        connect: body?.learningLanguages.map((l) => ({
                            id: l,
                        })),
                    },
                    parentFirstName: body.parentFirstName,
                    parentLastName: body.parentLastName,
                    parentDialCode: body.parentDialCode,
                    parentEmail: body.parentEmail,
                    parentPhoneNumber: body.parentPhoneNumber,
                },
            },
        };

        try {
            const result = await this.createUser(
                body,
                subdomainId,
                roleProfile
            );
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateStudent(userId: string, body: UpdateStudentDto) {
        const roleProfile = {
            student: {
                update: {
                    languagesSpoken: {
                        set: body?.languageCodes.map((l) => ({
                            code: l,
                        })),
                    },
                    learningLanguages: {
                        set: body?.learningLanguages.map((l) => ({
                            id: l,
                        })),
                    },
                    parentFirstName: body.parentFirstName,
                    parentLastName: body.parentLastName,
                    parentDialCode: body.parentDialCode,
                    parentEmail: body.parentEmail,
                    parentPhoneNumber: body.parentPhoneNumber,
                },
            },
        };

        try {
            const result = await this.updateUser(userId, body, roleProfile);
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    /*-------------------------------------------------------- CUSTOMER SERVICE --------------------------------------------------------*/

    async createCustomerService(
        body: CreateCustomerServiceDto,
        subdomainId: string
    ) {
        const roleProfile = {
            customerService: {
                create: {
                    emailNotificationOptions: body.emailNotificationOptions,
                },
            },
        };

        try {
            const result = await this.createUser(
                body,
                subdomainId,
                roleProfile
            );
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateCustomerService(
        userId: string,
        body: UpdateCustomerServiceDto
    ) {
        const roleProfile = {
            customerService: {
                update: {
                    emailNotificationOptions: body.emailNotificationOptions,
                },
            },
        };

        try {
            const result = await this.updateUser(userId, body, roleProfile);
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    /*-------------------------------------------------------- EDITOR --------------------------------------------------------*/

    async createEditor(body: CreateEditorDto, subdomainId: string) {
        const roleProfile = {
            editor: {
                create: {
                    emailNotificationOptions: body.emailNotificationOptions,
                },
            },
        };

        try {
            const result = await this.createUser(
                body,
                subdomainId,
                roleProfile
            );
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateEditor(userId: string, body: UpdateEditorDto) {
        const roleProfile = {
            editor: {
                update: {
                    emailNotificationOptions: body.emailNotificationOptions,
                },
            },
        };

        try {
            const result = await this.updateUser(userId, body, roleProfile);
            if (result) return true;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    /*-------------------------------------------------------- USER --------------------------------------------------------*/

    async createUser(
        body: CreateUserDto,
        subdomainId: string,
        roleProfile?: any
    ) {
        try {
            const emailExist = await this.prisma.user.findFirst({
                where: {
                    subdomainId,
                    email: body.email,
                },
            });
            if (emailExist) {
                throw new BadRequestException('Email already exist!');
            }

            const user = await this.prisma.user.create({
                data: {
                    email: body.email,
                    role: body.role as Role,
                    status: body.status,
                    subdomainId: subdomainId,
                    classTags: {
                        connect: body.classTagIds?.map((id) => ({
                            id,
                        })),
                    },
                    profile: {
                        create: {
                            avatarUrl: body.avatarUrl,
                            firstName: body.firstName,
                            lastName: body.lastName,
                            timezone: body.timezone,
                            socialLinks: JSON.stringify(userSocialLinks),
                            dialCode: body.dialCode,
                            phoneNumber: body.phoneNumber,
                            address: body.address,
                            zipCode: body.zipCode,
                            city: body.city,
                            state: body.state,
                            country: body.country,
                            ...roleProfile,
                        },
                    },
                },
            });

            const token = this.jwtService.sign(
                {
                    id: user.id,
                    email: user.email,
                    type: 'SET_PASSWORD',
                    subdomainId: user.subdomainId,
                },
                {
                    expiresIn: '1d',
                }
            );
            const templatePath = join(
                __dirname,
                './../../../client/html/set-password.html'
            );

            const subdomainUrl = await getSubdomainUrl(
                this.db,
                subdomainId
            );

            const _emailHelper = new SendEmailHelper();
            _emailHelper.send(
                user.email,
                'Immersio - Set password',
                templatePath,
                {
                    link: `${subdomainUrl}/login?hashcode=${token}`,
                }
            );

            return user;
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async updateUserSocial(id: string, body: UpdateUserSocialDto) {
        try {
            await this.prisma.profile.update({
                where: {
                    userId: id,
                },
                data: {
                    socialLinks: JSON.stringify({
                        ...body,
                    }),
                },
            });
            return true;
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async deleteUser(id: string) {
        const checkUser = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (!checkUser) {
            throw new BadGatewayException('User not found!');
        }

        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: moment().toISOString(),
            },
        });

        return true;
    }

    async updateUser(id: string, body: UpdateUserDto, roleProfile?: any) {
        const checkUser = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!checkUser) {
            throw new BadGatewayException('User not found!');
        }
        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                status: body.status,
                classTags: {
                    set: body.classTagIds?.map((id) => ({
                        id,
                    })),
                },
                profile: {
                    update: {
                        avatarUrl: body.avatarUrl,
                        firstName: body.firstName,
                        lastName: body.lastName,
                        timezone: body.timezone,
                        socialLinks: JSON.stringify(userSocialLinks),
                        dialCode: body.dialCode,
                        phoneNumber: body.phoneNumber,
                        address: body.address,
                        zipCode: body.zipCode,
                        city: body.city,
                        state: body.state,
                        country: body.country,
                        ...roleProfile,
                    },
                },
            },
        });
        return true;
    }

    async updateUserStatus(id: string, status: UserStatus) {
        const checkUser = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!checkUser) {
            throw new BadGatewayException('User not found!');
        }

        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/user-status-updated.html'
        );
        _emailHelper.send(
            checkUser.email,
            'Immersio - Your account status is updated',
            templatePath,
            {
                stauts: checkUser.status,
            }
        );

        return true;
    }

    async inviteInterview(userId: string, body: InviteInterviewDto) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!foundUser) throw new NotFoundException('Can not found user');

        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/invite-interview.html'
        );
        _emailHelper.send(
            foundUser.email,
            'Immersio - Invite for an interview',
            templatePath,
            {
                content: body.content,
            }
        );

        this.notificationService.create(userId, {
            title: 'Immersio - Invite for an interview',
            body: 'You\'re invited for an interview',
            type: 'INVITE_INTERVIEW',
            metadata: {
            },
        });
    }

    private _sendAccountInfoEmail(
        email: string,
        subdomainUrl: string,
        { firstName, password }: any
    ) {
        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const contentPath = join(
            __dirname,
            './../../../client/html/send-account-info.html'
        );

        const body = _emailHelper.buildStringTemplate(contentPath, {
            firstName,
            email,
            password,
        });

        _emailHelper.send(email, 'Welcome to Immersio', templatePath, {
            body,
            email,
            year: new Date().getFullYear(),
            subdomain: subdomainUrl,
        });
    }

    async createClassTag(subdomainId: string, body: CreateClassTagDto) {
        const tagExist = await this.prisma.classTag.findFirst({
            where: {
                name: body.name,
                subdomainId,
            },
        });
        if (tagExist) {
            throw new BadRequestException('Tag already exist!');
        }

        const tag = await this.prisma.classTag.create({
            data: {
                name: body.name,
                description: body.description,
                subdomainId,
            },
        });

        return tag;
    }

    async getClassTags(subdomainId: string, query: SearchParamsDto) {
        const queryRoles = [
            Role.INSTRUCTOR,
            Role.TUTOR,
            Role.CUSTOMER_SERVICE,
            Role.STUDENT,
        ];

        const _res = await this.prisma.classTag.findMany({
            include: {
                users: {
                    select: {
                        id: true,
                        role: true,
                    },
                    where: {
                        role: {
                            in: queryRoles,
                        },
                    },
                },
            },
            where:
                query.searchBy && query.searchKey
                    ? {
                        [query.searchBy]: {
                            contains: query.searchKey,
                        },
                        subdomainId,
                    }
                    : {
                        subdomainId,
                    },
            orderBy: query.sortBy
                ? {
                    [query.sortBy]: query.sortDesc ? 'desc' : 'asc',
                }
                : undefined,
            take: query.take,
            skip: query.skip,
        });

        const tags = _res.map(({ users, ...data }) => {
            return {
                ...data,
                connections: queryRoles.reduce((acc, cur, _) => {
                    const _key = cur.toLowerCase();
                    acc[_key] = users.filter((r) => r.role === cur).length;
                    return acc;
                }, {
                }),
            };
        });

        const total = await this.prisma.classTag.count({
            where:
                query.searchBy && query.searchKey
                    ? {
                        [query.searchBy]: {
                            contains: query.searchKey,
                        },
                        subdomainId,
                    }
                    : {
                        subdomainId,
                    },
        });

        return {
            data: tags,
            total,
        };
    }

    async updateClassTag(id: string, body: UpdateClassTagDto) {
        const tagExist = await this.prisma.classTag.findFirst({
            where: {
                id,
            },
        });
        if (!tagExist) {
            throw new NotFoundException('Tag not found!');
        }

        const tag = await this.prisma.classTag.update({
            where: {
                id,
            },
            data: {
                name: body.name,
                description: body.description,
            },
        });

        return tag;
    }

    async deleteClassTag(id: string) {
        const tagExist = await this.prisma.classTag.findFirst({
            where: {
                id,
            },
        });
        if (!tagExist) {
            throw new NotFoundException('Tag not found!');
        }

        await this.prisma.classTag.delete({
            where: {
                id,
            },
        });

        return true;
    }

    async getClassTagUsers(ids: string[]) {
        const idsStr = `('${ids.join('\',\'')}')`;

        const users = await this.prisma.$queryRawUnsafe(
            `
            SELECT DISTINCT ON("User"."id") "User"."id", "User"."email", "User"."subdomainId", "User"."role", row_to_json("Profile") as profile FROM "User"
            INNER JOIN "_ClassTagToUser" ON "User".id = "_ClassTagToUser"."B"
            INNER JOIN "Profile" ON "User".id = "Profile"."userId"
            WHERE "_ClassTagToUser"."A" IN ${idsStr} AND "User"."isDeleted" = false;
        `
        );

        return users;
    }

    async importInstructors(
        subdomainId: string,
        file: Express.Multer.File,
        mapping: ImportInstructorsDto
    ) {
        if (!file) {
            throw new BadRequestException('File not found!');
        }

        const csvString = file.buffer.toString('utf8');
        const jsonData = await csvToJson().fromString(csvString);

        const [classTags, courseLanguages, timeZones, status] =
            await Promise.all([
                this.prisma.classTag.findMany({
                    where: {
                        subdomainId,
                    },
                }),
                this.prisma.courseLanguage.findMany(),
                this.timeZoneService.findAll(),
                Object.values(UserStatus),
            ]);

        // create many instructors
        const result = await Promise.all(
            jsonData.map(async (instructor) => {
                try {
                    const classTagIds = [];
                    const teachLanguages = [];
                    const languageCodes = [];
                    let timezone: typeof timeZones[0] | undefined = undefined;

                    //  find class tag
                    // TODO: current input only one class tag
                    if (instructor[mapping.classTag || 'class_tag']) {
                        const classTag = classTags.find(
                            (tag) =>
                                tag.name ===
                                instructor[mapping.classTag || 'class_tag']
                        );
                        if (classTag) {
                            classTagIds.push(classTag.id);
                        } else {
                            throw new Error('Class tag not found!');
                        }
                    }

                    // find language teaching
                    // TODO: current input only one language
                    const languageTeaching = courseLanguages.find(
                        (teaching) =>
                            teaching.name ===
                            instructor[
                                mapping.teachLanguages || 'language_teaching'
                            ]
                    );

                    if (languageTeaching) {
                        teachLanguages.push(languageTeaching.id);
                    } else {
                        throw new Error('Language teaching not found!');
                    }

                    // find language code
                    // TODO: current input only one language code
                    const languageCode = courseLanguages.find(
                        (teaching) =>
                            teaching.name ===
                            instructor[
                                mapping.languageSpoken || 'language_spoken'
                            ]
                    );
                    if (languageCode) {
                        languageCodes.push(languageCode.code);
                    } else {
                        throw new Error('Language code not found!');
                    }

                    // find timezone
                    if (instructor[mapping.timeZone || 'time_zone']) {
                        timezone = timeZones.find(
                            (tz) =>
                                tz.text ===
                                instructor[mapping.timeZone || 'time_zone']
                        );
                        if (!timezone) {
                            throw new Error('Timezone not found!');
                        }
                    }

                    // find status
                    const accountStatus = status.find(
                        (s) =>
                            s ===
                            instructor[
                                mapping.accountStatus || 'account_status'
                            ]?.toUpperCase()
                    );
                    if (!accountStatus) {
                        throw new Error('Status not found!');
                    }

                    // phone number split dialCode
                    if (
                        instructor[mapping.phoneNumber || 'phone_number'].split(
                            ' '
                        ).length !== 2
                    ) {
                        throw new Error('Invalid phone number!');
                    }
                    const [dialCode, phoneNumber] =
                        instructor[mapping.phoneNumber || 'phone_number'].split(
                            ' '
                        );

                    // data to create
                    const data: CreateInstructorDto = {
                        firstName:
                            instructor[mapping.firstName || 'first_name'],
                        lastName: instructor[mapping.lastName || 'last_name'],
                        email: instructor[mapping.email || 'email'],
                        phoneNumber,
                        hourRate: +instructor[mapping.hourRate || 'hour_rate'],
                        teachLanguages,
                        languageCodes,
                        classTagIds,
                        timezone: timezone?.value,
                        status: accountStatus,
                        avatarUrl:
                            instructor[mapping.avatarUrl || 'avatar_url'],
                        address: instructor[mapping.address || 'address'],
                        zipCode: instructor[mapping.zipCode || 'zip_code'],
                        city: instructor[mapping.city || 'city'],
                        state: instructor[mapping.state || 'state'],
                        country: instructor[mapping.country || 'country'],
                        qualificationDesc:
                            instructor[
                                mapping.qualification || 'qualification'
                            ],
                        experienceDesc:
                            instructor[
                                mapping.teachingExperience ||
                            'teaching_experience'
                            ],
                        bio: instructor[mapping.bio || 'bio'],
                        role: Role.INSTRUCTOR,
                        dialCode,
                    };

                    await this.createInstructor(data, subdomainId);

                    return {
                        ...instructor,
                        success: true,
                    };
                } catch (err) {
                    return {
                        ...instructor,
                        success: false,
                        error: err.message,
                    };
                }
            })
        );

        return result;
    }

    async importTutors(
        subdomainId: string,
        file: Express.Multer.File,
        mapping: ImportTutorsDto
    ) {
        if (!file) {
            throw new BadRequestException('File not found!');
        }

        const csvString = file.buffer.toString('utf8');
        const jsonData = await csvToJson().fromString(csvString);

        const [classTags, courseLanguages, timeZones, status] =
            await Promise.all([
                this.prisma.classTag.findMany({
                    where: {
                        subdomainId,
                    },
                }),
                this.prisma.courseLanguage.findMany(),
                this.timeZoneService.findAll(),
                Object.values(UserStatus),
            ]);

        // create many tutors
        const result = await Promise.all(
            jsonData.map(async (tutor) => {
                try {
                    const classTagIds = [];
                    const teachLanguages = [];
                    const languageCodes = [];
                    let timezone: typeof timeZones[0] | undefined = undefined;

                    //  find class tag
                    // TODO: current input only one class tag
                    if (tutor[mapping.classTag || 'class_tag']) {
                        const classTag = classTags.find(
                            (tag) =>
                                tag.name ===
                                tutor[mapping.classTag || 'class_tag']
                        );
                        if (classTag) {
                            classTagIds.push(classTag.id);
                        } else {
                            throw new Error('Class tag not found!');
                        }
                    }

                    // find language teaching
                    // TODO: current input only one language
                    const languageTeaching = courseLanguages.find(
                        (teaching) =>
                            teaching.name ===
                            tutor[mapping.teachLanguages || 'language_teaching']
                    );

                    if (languageTeaching) {
                        teachLanguages.push(languageTeaching.id);
                    } else {
                        throw new Error('Language teaching not found!');
                    }

                    // find language code
                    // TODO: current input only one language code
                    const languageCode = courseLanguages.find(
                        (teaching) =>
                            teaching.name ===
                            tutor[mapping.languageSpoken || 'language_spoken']
                    );
                    if (languageCode) {
                        languageCodes.push(languageCode.code);
                    } else {
                        throw new Error('Language code not found!');
                    }

                    // find timezone
                    if (tutor[mapping.timeZone || 'time_zone']) {
                        timezone = timeZones.find(
                            (tz) =>
                                tz.text ===
                                tutor[mapping.timeZone || 'time_zone']
                        );
                        if (!timezone) {
                            throw new Error('Timezone not found!');
                        }
                    }

                    // find status
                    const accountStatus = status.find(
                        (s) =>
                            s ===
                            tutor[
                                mapping.accountStatus || 'account_status'
                            ]?.toUpperCase()
                    );
                    if (!accountStatus) {
                        throw new Error('Status not found!');
                    }

                    // phone number split dialCode
                    if (
                        tutor[mapping.phoneNumber || 'phone_number'].split(' ')
                            .length !== 2
                    ) {
                        throw new Error('Invalid phone number!');
                    }
                    const [dialCode, phoneNumber] =
                        tutor[mapping.phoneNumber || 'phone_number'].split(' ');

                    // data to create
                    const data: CreateTutorDto = {
                        firstName: tutor[mapping.firstName || 'first_name'],
                        lastName: tutor[mapping.lastName || 'last_name'],
                        email: tutor[mapping.email || 'email'],
                        phoneNumber,
                        hourRate: +tutor[mapping.hourRate || 'hour_rate'],
                        teachLanguages,
                        languageCodes,
                        classTagIds,
                        timezone: timezone?.value,
                        status: accountStatus,
                        avatarUrl: tutor[mapping.avatarUrl || 'avatar_url'],
                        address: tutor[mapping.address || 'address'],
                        zipCode: tutor[mapping.zipCode || 'zip_code'],
                        city: tutor[mapping.city || 'city'],
                        state: tutor[mapping.state || 'state'],
                        country: tutor[mapping.country || 'country'],
                        qualificationDesc:
                            tutor[mapping.qualification || 'qualification'],
                        experienceDesc:
                            tutor[
                                mapping.teachingExperience ||
                            'teaching_experience'
                            ],
                        bio: tutor[mapping.bio || 'bio'],
                        role: Role.TUTOR,
                        dialCode,
                    };

                    await this.createTutor(data, subdomainId);

                    return {
                        ...tutor,
                        success: true,
                    };
                } catch (err) {
                    return {
                        ...tutor,
                        success: false,
                        error: err.message,
                    };
                }
            })
        );

        return result;
    }

    async importStudents(
        subdomainId: string,
        file: Express.Multer.File,
        mapping: ImportStudentsDto
    ) {
        if (!file) {
            throw new BadRequestException('File not found!');
        }

        const csvString = file.buffer.toString('utf8');
        const jsonData = await csvToJson().fromString(csvString);

        const [classTags, courseLanguages, timeZones, status] =
            await Promise.all([
                this.prisma.classTag.findMany({
                    where: {
                        subdomainId,
                    },
                }),
                this.prisma.courseLanguage.findMany(),
                this.timeZoneService.findAll(),
                Object.values(UserStatus),
            ]);

        // create many tutors
        const result = await Promise.all(
            jsonData.map(async (student) => {
                try {
                    const classTagIds = [];
                    const languagesLearning = [];
                    const languageCodes = [];
                    let timezone: typeof timeZones[0] | undefined = undefined;

                    //  find class tag
                    // TODO: current input only one class tag
                    if (student[mapping.classTag || 'class_tag']) {
                        const classTag = classTags.find(
                            (tag) =>
                                tag.name ===
                                student[mapping.classTag || 'class_tag']
                        );
                        if (classTag) {
                            classTagIds.push(classTag.id);
                        } else {
                            throw new Error('Class tag not found!');
                        }
                    }

                    // find language learning
                    // TODO: current input only one language
                    const languageLearningFind = courseLanguages.find(
                        (language) =>
                            language.name ===
                            student[
                                mapping.languageLearning || 'language_learning'
                            ]
                    );
                    if (languageLearningFind) {
                        languagesLearning.push(languageLearningFind.id);
                    } else {
                        throw new Error('Language learning not found!');
                    }

                    // find language code
                    // TODO: current input only one language code
                    const languageCode = courseLanguages.find(
                        (language) =>
                            language.name ===
                            student[mapping.languageSpoken || 'language_spoken']
                    );
                    if (languageCode) {
                        languageCodes.push(languageCode.code);
                    } else {
                        throw new Error('Language code not found!');
                    }

                    // find timezone
                    if (student[mapping.timeZone || 'time_zone']) {
                        timezone = timeZones.find(
                            (tz) =>
                                tz.text ===
                                student[mapping.timeZone || 'time_zone']
                        );
                        if (!timezone) {
                            throw new Error('Timezone not found!');
                        }
                    }

                    // find status
                    const accountStatus = status.find(
                        (s) =>
                            s ===
                            student[
                                mapping.accountStatus || 'account_status'
                            ]?.toUpperCase()
                    );
                    if (!accountStatus) {
                        throw new Error('Status not found!');
                    }

                    // phone number split dialCode
                    if (
                        student[mapping.phoneNumber || 'phone_number'].split(
                            ' '
                        ).length !== 2
                    ) {
                        throw new Error('Invalid phone number!');
                    }
                    const [dialCode, phoneNumber] =
                        student[mapping.phoneNumber || 'phone_number'].split(
                            ' '
                        );

                    // parent phone number split dialCode
                    if (
                        student[
                            mapping.parentPhoneNumber || 'parent_phone_number'
                        ].split(' ').length !== 2
                    ) {
                        throw new Error('Invalid parent phone number!');
                    }
                    const [parentDialCode, parentPhoneNumber] =
                        student[
                            mapping.parentPhoneNumber || 'parent_phone_number'
                        ].split(' ');

                    // data to create
                    const data: CreateStudentDto = {
                        firstName: student[mapping.firstName || 'first_name'],
                        lastName: student[mapping.lastName || 'last_name'],
                        email: student[mapping.email || 'email'],
                        phoneNumber,
                        languageCodes,
                        classTagIds,
                        timezone: timezone?.value,
                        status: accountStatus,
                        avatarUrl: student[mapping.avatarUrl || 'avatar_url'],
                        address: student[mapping.address || 'address'],
                        zipCode: student[mapping.zipCode || 'zip_code'],
                        city: student[mapping.city || 'city'],
                        state: student[mapping.state || 'state'],
                        country: student[mapping.country || 'country'],
                        role: Role.STUDENT,
                        dialCode,
                        learningLanguages: languagesLearning,
                        parentEmail:
                            student[mapping.parentEmail || 'parent_email'],
                        parentFirstName:
                            student[
                                mapping.parentFirstName || 'parent_first_name'
                            ],
                        parentLastName:
                            student[
                                mapping.parentLastName || 'parent_last_name'
                            ],
                        parentDialCode,
                        parentPhoneNumber,
                    };

                    await this.createStudent(data, subdomainId);

                    return {
                        ...student,
                        success: true,
                    };
                } catch (err) {
                    return {
                        ...student,
                        success: false,
                        error: err.message,
                    };
                }
            })
        );

        return result;
    }

    async resendVerifyEmail(subdomainId: string, userId: string) {
        //TODO: replace by mail service later on
        const foundUser = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                profile: true,
            },
        });
        if (!foundUser) throw new NotFoundException();
        if (foundUser.role != Role.INSTRUCTOR && foundUser.role != Role.TUTOR)
            throw new BadRequestException();

        const { email, role, profile } = foundUser;

        const token = this.jwtService.sign({
            email: email,
            type: 'VERIFY_EMAIL',
            subdomainId: subdomainId,
        });

        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const verifyPath = join(
            __dirname,
            './../../../client/html/verify-email.html'
        );
        let confirmMsg =
            'Please confirm your email so you can begin your journey learning.';
        let confirmInfo =
            'By confirming, you\'ll be subscribed to our suggested notifications. You can customize your settings or unsubscribe anytime.';

        switch (role) {
        case Role.INSTRUCTOR:
            confirmMsg =
                    'Please confirm your email so you can begin teaching.';
            confirmInfo =
                    'By confirming, you can expect to hear back from us within 5 business days.';
            break;
        case Role.TUTOR:
            confirmMsg =
                    'Please confirm your email so you can begin tutoring.';
            confirmInfo =
                    'By confirming, you can expect to hear back from us within 5 business days.';
            break;
        }

        const subdomainUrl = await getSubdomainUrl(this.db, subdomainId);

        const body = _emailHelper.buildStringTemplate(verifyPath, {
            firstName: profile.firstName,
            link: `${subdomainUrl}/verify-email?hashcode=${token}`,
            confirmMsg,
            confirmInfo,
        });

        _emailHelper.send(
            email,
            'Confirm your Email with Immersio',
            templatePath,
            {
                body,
                email,
                year: new Date().getFullYear(),
                subdomain: subdomainUrl,
            }
        );
    }
}
