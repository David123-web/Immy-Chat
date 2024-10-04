import {BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, SocialMediaType, UserStatus } from '@prisma/client';
import { Encrypt } from 'src/helpers/encrypt';
import { PrismaService } from '../prisma/prisma.service';
import RegisterDto from './dto/register.dto';
import { UsersService } from '../users/users.service';
import LoginDto from './dto/login.dto';
import ForgotPasswordDto from './dto/forgot-password.dto';
// import MailHelper from 'src/helpers/mail';
import RequestMagicLoginDto from './dto/request-magic-login.dto';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';
import { SendEmailHelper } from '../../helpers/send-email';
import { join } from 'path';
import { RegexHelper } from 'src/helpers/regex';
import VerifyMagicTokenDto from './dto/verify-magic-token.dto';
import ThirdPartyDto from './dto/login-third-party.dto';
import { verifyFacebookAccessToken } from '../../helpers/facebook';
import { getGoogleUserId } from '../../helpers/google';
import ChangeForgotPasswordDto from './dto/change-forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import VerifyEmailDto from './dto/verify-email.dto';
import { StripeHelper } from '../../helpers/stripe';
import RegisterInstructorDto from './dto/register-instructor.dto';
import CheckEmailDto from './dto/check-email.dto';
import * as cuid from 'cuid';
import { getSubdomainUrl } from 'src/helpers/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        // private mailHelper: MailHelper,
        private prisma: PrismaService,
        private readonly http: HttpService,
        private readonly stripe: StripeHelper,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async validateUser(
        subdomainId: string,
        email: string,
        pass: string
    ): Promise<any> {
        const user = await this.usersService.findOne(subdomainId, email);
        const valid = await Encrypt.cryptPassword(pass);
        if (!valid) return null;

        const { password, ...result } = user;
        return result;
    }

    async verifyToken(token: string) {
        try {
            const data = this.jwtService.verify(token);
            const user = await this.usersService.findOne(
                data.subdomainId,
                data.email,
                true
            );
            const { password, ...profile } = user;
            return profile;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    async requestForEmailVerification({ token }: VerifyEmailDto) {
        try {
            const data = this.jwtService.verify(token);
            const { type, email, subdomainId } = data;
            if (type !== 'VERIFY_EMAIL')
                throw new InternalServerErrorException();

            const user = await this.usersService.findOne(
                subdomainId,
                email,
                true
            );
            if (!user)
                throw new NotFoundException('Your account is not registered');
            await this.db
                .updateTable('User')
                .where('id', '=', user.id)
                .set({
                    isVerified: true,
                    updatedAt: new Date().toISOString()
                })
                .executeTakeFirst();
            return HttpStatus.OK;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async confirmEmailVerification(token: string) {
        const { device_token, email, subdomainId } =
            this.jwtService.verify(token);
        const user = await this.usersService.findOne(subdomainId, email);

        if (!user) throw new NotFoundException();

        await this.db
            .updateTable('User')
            .where('email', '=', email.trim().toLowerCase())
            .set({
                isVerified: true,
                updatedAt: new Date().toISOString()
            })
            .executeTakeFirst();

        // const payload = {
        //     email: user.email,
        //     id: user.id,
        //     role: user.role,
        // };

        return true;
    }

    async login(request: any, { email, password }: LoginDto, isAdmin = false) {
        return this._login(request, email, {
            password,
            isAdmin,
        });
    }

    async register(subdomainId: string, dto: RegisterDto) {
        if (!subdomainId) throw new ForbiddenException();

        const { role, firstName, lastName, email, phoneNumber } = dto;
        if (role === Role.SUBDOMAIN_ADMIN || role === Role.SUPER_ADMIN)
            throw new ForbiddenException();

        const foundEmail = await this.db
            .selectFrom('User')
            .where('email', '=', email.toLowerCase())
            .where('subdomainId', '=', subdomainId)
            .executeTakeFirst();

        if (foundEmail) throw new ConflictException('Email already existed!');
        const mediaFolderId = cuid();
        const { password, ...info } = await this.prisma.user.create({
            data: {
                subdomainId,
                email: email.toLowerCase(),
                password: await Encrypt.cryptPassword(dto.password),
                role: role ?? Role.STUDENT,
                status:
                    role === Role.STUDENT
                        ? UserStatus.ACTIVE
                        : UserStatus.PENDING,
                profile: firstName &&
                    lastName && {
                    create: {
                        firstName,
                        phoneNumber,
                        lastName,
                        student:
                            role === Role.STUDENT
                                ? {
                                    create: {
                                    },
                                }
                                : undefined,
                        isApproved:
                            role !== Role.INSTRUCTOR && role !== Role.TUTOR,
                    },
                },
                folders: {
                    createMany: {
                        data: [
                            {
                                id: mediaFolderId,
                                name: 'Media',
                                fixed: true,
                            },
                            {
                                name: 'Homework',
                                fixed: true,
                            },
                            {
                                name: 'Presentation',
                                fixed: true,
                            },
                            {
                                parentFolderId: mediaFolderId,
                                name: 'Image',
                                fixed: true,
                            },
                            {
                                parentFolderId: mediaFolderId,
                                name: 'Audio',
                                fixed: true,
                            },
                            {
                                parentFolderId: mediaFolderId,
                                name: 'Video',
                                fixed: true,
                            },
                        ],
                    },
                },
            },
        });

        this._sendVerifyEmail(subdomainId, email, {
            role,
            firstName,
        });
        return info;
    }

    async checkEmailExist(subdomainId: string, { email }: CheckEmailDto) {
        const found = await this.db
            .selectFrom('User')
            .where('email', '=', email)
            .where('subdomainId', '=', subdomainId)
            .executeTakeFirst();
        return !!found;
    }

    async registerInstructor(subdomainId: string, dto: RegisterInstructorDto) {
        const createdUser = await this.register(subdomainId, dto);
        const { email, password, ...instructorTutorProfile } = dto;
        await this.usersService.changeInstructorOrTutorProfile(
            createdUser,
            instructorTutorProfile,
            true
        );
    }

    private async _sendVerifyEmail(
        subdomainId: string,
        email: string,
        { role, firstName }: any
    ) {
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
            firstName,
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

    async forgotPassword(request: any, { email }: ForgotPasswordDto) {
        const user = await this.db
            .selectFrom('User')
            .where('email', '=', email)
            .where('subdomainId', '=', request.subdomainId)
            .selectAll()
            .executeTakeFirst();
        if (!user) throw new NotFoundException('User not found');

        const token = this.jwtService.sign(
            {
                id: user.id,
                email,
                type: 'FORGOT_PASSWORD',
                subdomainId: user.subdomainId,
            },
            {
                expiresIn: '1d',
            }
        );
        const templatePath = join(
            __dirname,
            './../../../client/html/forgot-password.html'
        );

        const subdomainUrl = await getSubdomainUrl(
            this.db,
            request.subdomainId
        );

        const _emailHelper = new SendEmailHelper();
        _emailHelper.send(email, 'Immersio - Forgot password', templatePath, {
            link: `${subdomainUrl}/login?hashcode=${token}`,
        });
        return true;
    }

    // set password and change forgot password
    async changeForgotPassword(
        token: string,
        { newPassword }: ChangeForgotPasswordDto
    ) {
        const jwt = this.jwtService.verify(token);
        if (
            !jwt ||
            (jwt?.type !== 'FORGOT_PASSWORD' && jwt?.type !== 'SET_PASSWORD')
        )
            throw new BadRequestException();
        const user = await this.db
            .updateTable('User')
            .where('id', '=', jwt.id)
            .set({
                password: await Encrypt.cryptPassword(newPassword),
                updatedAt: new Date().toISOString()
            })
            .returning(eb => [
                'subdomainId', 'email', 'role',
                jsonObjectFrom(eb.selectFrom('Profile').whereRef('userId', '=', 'User.id').select('firstName')).as('profile')
            ])
            .executeTakeFirst();
        if (jwt.type === 'SET_PASSWORD') {
            this._sendVerifyEmail(user.subdomainId, user.email, {
                role: user.role,
                firstName: user.profile.firstName,
            });
        }

        return true;
    }

    async _login(
        request: any,
        email: string,
        { password: pwd, data, isAdmin }: any
    ) {
        let subdomainId;
        let subdomainName;

        if (isAdmin) {
            const adminUser = await this.db
                .selectFrom('User')
                .where('email', '=', email)
                .where('role', 'in', [Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN])
                .select(eb => [
                    'subdomainId',
                    jsonObjectFrom(eb.selectFrom('Subdomain').whereRef('id', '=', 'User.subdomainId').select('name')).as('subdomain')
                ])
                .executeTakeFirst();
            if (!adminUser) throw new NotFoundException();
            const subdomain = adminUser.subdomain;
            subdomainName = subdomain.name;
            subdomainId = adminUser.subdomainId;
        } else {
            subdomainId = request.subdomainId;
        }
        const user = await this._checkAndGetValidUser(
            subdomainId,
            email,
            pwd
        ).then(
            (user) => user,
            async (err) => {
                if (err.status === 404) {
                    if (!data) throw new NotFoundException();
                    return this.prisma.user.create({
                        data: {
                            email,
                            password: '',
                            isFirstTimeLogin: true,
                            profile: {
                                create: {
                                    firstName: data['given_name'],
                                    lastName: data['family_name'],
                                },
                            },
                            role: Role.SUPER_ADMIN,
                        },
                    });
                }
                throw err;
            }
        );

        const { password, ...result } = await this.usersService.checkAndGetUser(
            user.id
        );

        const notSendEmailRoles = [Role.SUPER_ADMIN].toString();

        if (!user.isFirstTimeLogin && !notSendEmailRoles.includes(user.role)) {
            const subdomainUrl = await getSubdomainUrl(
                this.db,
                subdomainId
            );

            const { id, email, role } = user;
            const { firstName } = result.profile;
            await this.db
                .updateTable('User')
                .where('id', '=', id)
                .set({
                    isFirstTimeLogin: true,
                    updatedAt: new Date().toISOString()
                })
                .executeTakeFirst();
            switch (role) {
            case Role.INSTRUCTOR:
            case Role.TUTOR:
                this._sendOrientationEmail(email, {
                    firstName,
                    subdomain: subdomainUrl,
                    createCourseLink: `${subdomainUrl}/instructor`,
                    registerLink: `${subdomainUrl}/teach`,
                    resourcesLink: '',
                });
                break;
            default:
                this._sendWelcomeEmail(email, subdomainUrl, firstName);
                break;
            }
        }

        let stripeAccount;
        // const adminRoles = [Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN];

        // if (!adminRoles.includes(user.role as any)) {
        //     stripeAccount = await this._handleStripeAccount({
        //         subdomainId: user.subdomainId,
        //         userId: user.id,
        //         stripeAccountId: result.stripeAccountId,
        //         email,
        //     });
        // }

        return {
            ...result,
            subdomainName,
            stripeAccount,
            accessToken: this.jwtService.sign({
                email: user.email,
                id: user.id,
                role: user.role,
                subdomainId: user.subdomainId,
            }),
        };
    }

    // private async _handleStripeAccount({
    //     subdomainId,
    //     userId,
    //     stripeAccountId,
    //     email,
    // }) {
    //     if (stripeAccountId)
    //         return await this.stripe.getCustomerById(
    //             subdomainId,
    //             stripeAccountId
    //         );
    //     const result = await this.stripe.createCustomer(subdomainId, email, '');
    //     if (result) {
    //         await this.prisma.user.update({
    //             where: {
    //                 id: userId,
    //             },
    //             data: {
    //                 stripeAccountId: result.id,
    //             },
    //         });
    //         return result;
    //     }
    // }

    private _sendOrientationEmail(
        email,
        { firstName, subdomain, createCourseLink, registerLink, resourcesLink }
    ) {
        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const orientationPath = join(
            __dirname,
            './../../../client/html/orientation-email.html'
        );

        const body = _emailHelper.buildStringTemplate(orientationPath, {
            firstName,
            subdomain,
            createCourseLink,
            registerLink,
            resourcesLink,
        });

        _emailHelper.send(
            email,
            'Orientation Email for Tutors/Instructors',
            templatePath,
            {
                body,
                email,
                year: new Date().getFullYear(),
                subdomain: subdomain,
            }
        );
    }

    private _sendWelcomeEmail(
        email: string,
        subdomainUrl: string,
        { firstName }: any
    ) {
        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const welcomePath = join(
            __dirname,
            './../../../client/html/welcome-email.html'
        );
        const btnMsg = 'Start learning';
        const msg = 'Happy learning';

        const body = _emailHelper.buildStringTemplate(welcomePath, {
            firstName,
            btnMsg,
            btnLink: `${subdomainUrl}/student`,
            dashboardLink: `${subdomainUrl}/student`,
            email,
            msg,
        });

        _emailHelper.send(email, 'Welcome to Immersio', templatePath, {
            body,
            email,
            year: new Date().getFullYear(),
            subdomain: subdomainUrl,
        });
    }

    async _checkAndGetValidUser(
        subdomainId: string,
        email: string,
        password?: string
    ) {
        const { password: pwd, ...user } = await this.usersService.findOne(
            subdomainId,
            email,
            true
        );

        const acceptedRoles = [Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN];
        const acceptedStatus = [UserStatus.ACTIVE, UserStatus.APPROVED];

        if (
            !user ||
            (password && !(await Encrypt.comparePassword(password, pwd)))
        )
            throw new NotFoundException('Incorrect email or password!');
        if (!user.isVerified)
            throw new ForbiddenException('Account is not verified!');

        if (
            !acceptedRoles.includes(user.role as any) &&
            !acceptedStatus.includes(user.status as any)
        )
            throw new NotFoundException('Login failed');

        return user;
    }

    async _findOrCreate3rdPartyUser(subdomainId: string, data: ThirdPartyDto) {
        const { socialId, socialType, firstName, lastName, role, accessToken } =
            data;

        if (role === Role.SUPER_ADMIN || role === Role.SUBDOMAIN_ADMIN)
            throw new ForbiddenException();
        let isTokenValid = false;
        switch (socialType) {
        case SocialMediaType.FACEBOOK:
            isTokenValid = await verifyFacebookAccessToken(accessToken);
            break;
        case SocialMediaType.GOOGLE:
            const userId = await getGoogleUserId(accessToken);
            isTokenValid = !!userId;
            data.socialId = userId;
            break;
        default:
            throw new InternalServerErrorException();
        }

        if (!isTokenValid)
            throw new ConflictException('Your account is invalid');

        let roleProfile;

        const user = await this.db
            .selectFrom('User')
            .where('socialAuthenId', '=', socialId)
            .selectAll()
            .select(eb => [
                jsonObjectFrom(eb.selectFrom('Profile').whereRef('userId', '=', 'User.id').selectAll()).as('profile')
            ])
            .executeTakeFirst();

        /* -------------------------- Create 3rd user -------------------------- */
        if (!user) {
            const res = await this.db
                .insertInto('SocialAuthen')
                .values({
                    id: socialId,
                    type: socialType,
                    subdomainId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                .returningAll()
                .executeTakeFirst();


            if (!res || !role) throw new InternalServerErrorException();
            const mediaFolderId = cuid();

            const createdUser = await this.prisma.user.create({
                data: {
                    socialAuthenId: socialId,
                    isVerified: true,
                    status:
                        role === Role.STUDENT
                            ? UserStatus.ACTIVE
                            : UserStatus.PENDING,
                    role,
                    subdomainId,
                    profile: {
                        create: {
                            firstName,
                            lastName,
                            student:
                                role === Role.STUDENT
                                    ? {
                                        create: {
                                        },
                                    }
                                    : undefined,
                        },
                    },
                    folders: {
                        createMany: {
                            data: [
                                {
                                    id: mediaFolderId,
                                    name: 'Media',
                                    fixed: true,
                                },
                                {
                                    name: 'Homework',
                                    fixed: true,
                                },
                                {
                                    name: 'Presentation',
                                    fixed: true,
                                },
                                {
                                    parentFolderId: mediaFolderId,
                                    name: 'Image',
                                    fixed: true,
                                },
                                {
                                    parentFolderId: mediaFolderId,
                                    name: 'Audio',
                                    fixed: true,
                                },
                                {
                                    parentFolderId: mediaFolderId,
                                    name: 'Video',
                                    fixed: true,
                                },
                            ],
                        },
                    },
                },
            });
            if (!createdUser) throw new InternalServerErrorException();
            return {
                ...createdUser,
                accessToken: this.jwtService.sign({
                    id: createdUser.id,
                    role: createdUser.role,
                    subdomainId: createdUser.subdomainId,
                }),
            };
        }

        /* -------------------------- Find 3rd user -------------------------- */

        const acceptedRoles = [Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN];
        const acceptedStatus = [UserStatus.ACTIVE, UserStatus.APPROVED];

        if (!user.isVerified)
            throw new ForbiddenException('Account is not verified!');

        if (
            !acceptedRoles.includes(user.role as any) &&
            !acceptedStatus.includes(user.status as any)
        )
            throw new NotFoundException('Login failed');

        if (user.profile) {
            roleProfile = await this.prisma.profile.findFirst({
                where: {
                    OR: [
                        {
                            instructorId: user.profile.instructorId,
                            tutorId: user.profile.tutorId,
                            studentId: user.profile.studentId,
                            customerServiceId: user.profile.customerServiceId,
                            editorId: user.profile.editorId,
                        },
                    ],
                },
            });
        }

        delete user.password;
        return {
            ...user,
            roleProfile,
            accessToken: this.jwtService.sign({
                id: user.id,
                role: user.role,
                subdomainId: user.subdomainId,
            }),
        };
    }

    async requestMagicLink(
        subdomainId: string,
        { email }: RequestMagicLoginDto
    ) {
        const user = await this.usersService.findOne(subdomainId, email);
        if (!user) throw new NotFoundException();
        if (!user.isVerified)
            throw new ForbiddenException('Account is not verified!');

        const hash = await Encrypt.cryptPassword(`${Date.now()}`);
        const token = RegexHelper.replaceNonAscii(hash);
        const result = await this.prisma.magicToken.create({
            data: {
                token,
                userId: user.id,
                expiredAt: dayjs()
                    .add(parseInt(process.env.TTL_MAGIC_LINK), 'minutes')
                    .toDate(),
            },
        });
        if (!result.id) throw new InternalServerErrorException();

        const magicLink = new URL(process.env.FE_HOST);
        magicLink.searchParams.set('token', token);
        const templatePath = join(
            __dirname,
            './../../../client/html/email.html'
        );

        //TODO: replace with real data
        const _emailHelper = new SendEmailHelper();
        _emailHelper.send(email, 'Test-magic-link', templatePath, {
            name: 'Trien',
            number: magicLink,
        });
        return;
    }

    async verifyMagicToken({ token }: VerifyMagicTokenDto) {
        const found = await this.db
            .selectFrom('MagicToken')
            .where('token', '=', token)
            .selectAll()
            .executeTakeFirst();
        let roleProfile = {
        };
        if (!found) throw new NotFoundException('Can not find your account');
        if (found.expiredAt.getTime() < Date.now())
            throw new NotAcceptableException('Your link is expired');

        const user = await this.db
            .selectFrom('User')
            .where('id', '=', found.userId)
            .selectAll()
            .select(eb => [
                jsonObjectFrom(eb.selectFrom('Profile').whereRef('userId', '=', 'User.id').selectAll()).as('profile')
            ])
            .executeTakeFirst();

        if (!user) throw new NotFoundException('Can not find your account');

        delete user.password;
        await this.db
            .deleteFrom('MagicToken')
            .where('id', '=', found.id)
            .executeTakeFirst();

        if (user.profile && user.profile.instructorId) {
            roleProfile = await this.db
                .selectFrom('Profile')
                .where('instructorId', '=', user.profile.instructorId)
                .selectAll()
                .executeTakeFirst();
        }

        delete user.password;
        return {
            ...user,
            roleProfile,
            accessToken: this.jwtService.sign({
                id: user.id,
                role: user.role,
                subdomainId: user.subdomainId,
            }),
        };
    }
}
