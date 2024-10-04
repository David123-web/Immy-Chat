import {BadRequestException,
    ForbiddenException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,} from '@nestjs/common';
import { Role, User, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { searchWithKeys } from '../../utils/object';
import { Encrypt } from 'src/helpers/encrypt';
import ChangeProfileDto from './dto/change-profile.dto';
import FindUserDto from './dto/find-user.dto';
import SelfChangePasswordDto from './dto/self-change-password';
import { UpdateUserDto } from './dto/update-user-dto';
import VerifyDto from './dto/verify.dto';
import FindInstructorDto from './dto/find-instructor-dto';
import { join } from 'path';
import { SendEmailHelper } from '../../helpers/send-email';
import { UpdateUserCreditsDto } from './dto/update-user-credits-dto';
import ApproveInstructorDto from './dto/apporve-instructor.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import s3 from '../../helpers/s3';
import * as sharp from 'sharp';
import { RoleManagementService } from '../role-management/role-management.service';
import ChangeInstructorOrTutorProfileDto from './dto/change-instructor-or-tutor-profile.dto';
import FindTutorDto from './dto/find-tutor-dto';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { getSubdomainUrl } from 'src/helpers/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { BaseProfileDto } from './dto/base-profile.dto';
@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly roleManagementService: RoleManagementService,
    private readonly subdomainSettingsService: SubdomainSettingsService,
    @InjectKysely() private db: Kysely<DB>
    ) {}

    async onModuleInit() {
        if (this.configService.get('INIT_PROJECT')) await this.init();
    }

    async init() {}

    async findOne(
        subdomainId: string,
        email: string,
        withAvatar = false
    ): Promise<User> {
        const user = await this.db
            .selectFrom('User')
            .where('email', '=', email.trim().toLowerCase())
            .where('subdomainId', '=', subdomainId)
            .selectAll()
            .executeTakeFirst();
        if (!user) throw new NotFoundException();
        return user;
    }

    async findById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                profile: true,
            },
        });
        if (!user) throw new NotFoundException();

        return user;
    }

    async getUserCredits(userId: string) {
        const user = await this.findById(userId);
        const subdomainSettings = await this.subdomainSettingsService.get(
            user.subdomainId
        );
        return {
            availableCredits: user.availableCredits,
            bookedCredits: user.bookedCredits,
            usedCredits: user.usedCredits,
            userId: user.id,
            creditValue: subdomainSettings.creditValue,
            currency: subdomainSettings.currency,
        };
    }

    async verify(
        subdomainId: string,
        { email, verified }: VerifyDto
    ): Promise<User> {
        const user = await this.findOne(subdomainId, email);
        if (!user) throw new NotFoundException('User not found!');

        const users = await this.prisma.user.updateMany({
            where: {
                email,
            },
            data: {
                role: Role.STUDENT,
            },
        });

        return users[0];
    }

    async _createProfile(userId: string, data: ChangeProfileDto){
        const { socialLinks, firstName, lastName, address, avatarUrl, dob, gender, phoneNumber  } = data;
        const profile = await this.prisma.profile.create({
            data: {
                firstName: firstName, 
                lastName: lastName, 
                address: address, 
                avatarUrl: avatarUrl, 
                dob: dob, 
                gender: gender, 
                phoneNumber: phoneNumber, 
                socialLinks: socialLinks
                    ? JSON.stringify({
                        ...socialLinks,
                    })
                    : null,
                userId,
                isApproved: true,
            },
        });
        return profile;

    }

    async _upsertInstructorTutorProfile(userId: string, data: ChangeProfileDto ){
       
        const profile: any = await this.getUserDetail(userId);
        const { user } = profile;
        const { bio, hourRate, teachLanguages, socialLinks, ...commonProfile } = data;
        const _newProfile = {
            teachLanguages,
            bio,
            hourRate,
        };

        let  updatedInstructor, updatedTutor;
        switch (data.role) {
                
        case Role.INSTRUCTOR:
            updatedInstructor = await this.handleUpsertInstructorProfile(
                profile?.instructorId || 0,
                _newProfile
            );
            break;
        case Role.TUTOR:
            updatedTutor = await this.handleUpsertTutorProfile(profile?.tutorId || 0, _newProfile);
            break;
        }
        return {
            updatedInstructor, updatedTutor
        };
    }


    async _createProfileIfNotExists(userId: string, data: ChangeProfileDto){
        const found = await this.prisma.profile.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });

        if (!found) {
            return await this._createProfile(userId, data);
        } else {
            return found;
        }
    }

    async changeProfile(userId: string, data: ChangeProfileDto) {
        const found = await this._createProfileIfNotExists(userId, data);

        
        const { bio, hourRate, teachLanguages, socialLinks, ...commonProfile } = data;
        const _newProfile = {
            teachLanguages,
            bio,
            hourRate,
        };

        try {
            const {
                firstName, lastName, bio, 
                address, avatarUrl, dob, 
                gender, phoneNumber, 
                socialLinks, hourRate, teachLanguages
            } = data; 
            


               

            await this._upsertInstructorTutorProfile(userId, data);


            await this.prisma.profile.update({
                where: {
                    id: found.id,
                },
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    avatarUrl: avatarUrl,
                    dob: dob,
                    gender: gender,
                    phoneNumber: phoneNumber,
                    socialLinks: socialLinks

                        ? JSON.stringify({
                            ...socialLinks,
                        })
                        : null,
                },
            });
            return HttpStatus.OK;

        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async changePassword(
        userId: string,
        { oldPassword, newPassword }: SelfChangePasswordDto
    ) {
        const user = await this.checkAndGetUser(userId);
        if (!(await Encrypt.comparePassword(oldPassword, user.password)))
            throw new BadRequestException('Incorrect password!');
        if (oldPassword === newPassword)
            throw new BadRequestException(
                'New password cannot be the same as old password!'
            );
        if (!newPassword)
            throw new BadRequestException('New password cannot be empty!');
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: await Encrypt.cryptPassword(newPassword),
            },
        });

        return true;
    }

    async find({
        skip,
        take,
        cursorId,
        role,
        searchUser: contains,
        sortBy,
        sortDesc,
    }: FindUserDto) {
        return this.prisma.user.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                role,
                isDeleted: false,
                OR:
          contains &&
          searchWithKeys(
              ['email', 'firstName', 'lastName'],
              contains,
              'insensitive'
          ),
            },
            orderBy: sortBy
                ? {
                    [sortBy.replace('name', 'firstName')]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
    }

    async count({ role, searchUser: contains }: FindUserDto) {
        return this.prisma.user.count({
            where: {
                role,
                isDeleted: false,
                OR:
          contains &&
          searchWithKeys(
              ['email', 'firstName', 'lastName'],
              contains,
              'insensitive'
          ),
            },
        });
    }

    async checkAndGetUser(userId: string) {
        const userFieldsToCount = ['email', 'status'];
        const profileFieldsToCount = [
            'avatarUrl',
            'firstName',
            'lastName',
            'timezone',
            'address',
            'zipCode',
            'city',
            'state',
            'country',
            'dialCode',
            'phoneNumber',
        ];

        const user: any = await this.db
            .selectFrom('User')
            .where('id', '=', userId)
            .selectAll()
            .select((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Profile')
                        .whereRef('userId', '=', 'User.id')
                        .selectAll()
                ).as('profile'),
            ])
            .executeTakeFirst();
        if (!user) throw new NotFoundException();
        const classTags = await this.db
            .selectFrom('_ClassTagToUser')
            .where('B', '=', userId)
            .select((eb) => [
                jsonObjectFrom(
                    eb.selectFrom('ClassTag').whereRef('id', '=', 'A').selectAll()
                ).as('data'),
            ])
            .execute();
        user.classTags = classTags.map((i) => i.data);

        if (!user.profile) return user;

        let roleProfile,
            roleProfileFieldsToCount = [],
            stripeAccount;

        // Count the number of non-null fields in the user and profile table
        const unacceptableValues = [null, undefined, ''];

        const completedUserFields = userFieldsToCount.filter((field) =>
            Array.isArray(user[field])
                ? user[field].length > 0
                : !unacceptableValues.includes(user[field])
        ).length;

        const completedProfileFields = profileFieldsToCount.filter((field) =>
            Array.isArray(user.profile[field])
                ? user.profile[field].length > 0
                : !unacceptableValues.includes(user.profile[field])
        ).length;

        let completedRoleFields = 0;

        switch (user.role) {
        case Role.INSTRUCTOR:
            if (!user.profile.instructorId) break;
            roleProfileFieldsToCount = [
                'bio',
                'experienceDesc',
                'qualificationDesc',
                'hourRate',
                'teachLanguages',
                'languagesSpoken',
                'proficiencyLevel',
            ];

            roleProfile = await this.prisma.instructor.findUnique({
                where: {
                    id: user.profile.instructorId,
                },
                include: {
                    teachLanguages: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    languagesSpoken: true,
                },
            });

            break;
        case Role.TUTOR:
            if (!user.profile.tutorId) break;
            roleProfileFieldsToCount = [
                'bio',
                'experienceDesc',
                'qualificationDesc',
                'hourRate',
                'teachLanguages',
                'languagesSpoken',
                'proficiencyLevel',
            ];

            roleProfile = await this.prisma.tutor.findUnique({
                where: {
                    id: user.profile.tutorId,
                },
                include: {
                    teachLanguages: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    languagesSpoken: true,
                },
            });

            break;
        case Role.STUDENT:
            if (!user.profile.studentId) break;
            roleProfileFieldsToCount = [
                'learningLanguages',
                'languagesSpoken',
                'parentFirstName',
                'parentLastName',
                'parentDialCode',
                'parentPhoneNumber',
            ];

            roleProfile = await this.prisma.student.findUnique({
                where: {
                    id: user.profile.studentId,
                },
                include: {
                    learningLanguages: true,
                    languagesSpoken: true,
                },
            });
            break;
        case Role.CUSTOMER_SERVICE:
            if (!user.profile.customerServiceId) break;
            roleProfileFieldsToCount = ['emailNotificationOptions'];

            roleProfile = await this.prisma.customerService.findUnique({
                where: {
                    id: user.profile.customerServiceId,
                },
            });
            break;
        case Role.EDITOR:
            if (!user.profile.editorId) break;
            roleProfileFieldsToCount = ['emailNotificationOptions'];

            roleProfile = await this.prisma.editor.findUnique({
                where: {
                    id: user.profile.editorId,
                },
            });
            break;
        default:
            break;
        }

        const { id, userId: userProfileId, socialLinks, ...profile } = user.profile;

        let parsedSocialLinks;
        if (socialLinks) {
            parsedSocialLinks = JSON.parse(socialLinks);
        }

        completedRoleFields = roleProfileFieldsToCount.filter((field) =>
            Array.isArray(roleProfile[field])
                ? roleProfile[field].length > 0
                : !unacceptableValues.includes(roleProfile[field])
        ).length;

        const requireFieldsLength =
      userFieldsToCount.length +
      profileFieldsToCount.length +
      roleProfileFieldsToCount.length;
        const completedFieldsLength =
      completedUserFields + completedProfileFields + completedRoleFields;
        const profileCompletion = parseFloat(
            (completedFieldsLength / requireFieldsLength).toFixed(2)
        );

        return {
            ...user,
            profile: {
                ...profile,
                profileCompletion,
                socialLinks: parsedSocialLinks,
            },
            roleProfile,
            stripeAccount,
        };
    }

    async getUserDetail(userId: string) {
        const { password, ...user } = await this.checkAndGetUser(userId);
        const accesses = await this.roleManagementService.findWithRole(
            user.role,
            user.subdomainId
        );
        return {
            ...user,
            accesses: accesses ? accesses.value : null,
        };
    }

    async update(userId: string, data: UpdateUserDto) {
        await this.checkAndGetUser(userId);
        const { password, ...result } = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                profile: {
                    update: data,
                },
            },
        });
        return result;
    }

    async updateUserCredits(userId: string, data: UpdateUserCreditsDto) {
        await this.checkAndGetUser(userId);
        const { ...result } = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                
                availableCredits: data.availableCredits,
                bookedCredits: data.bookedCredits,
                usedCredits: data.usedCredits,
                
            },
        });
        return result;
    }

    
    async _updateUser(data:BaseProfileDto, user: any, instructorProfile, tutorProfile){
        const { role, avatarUrl, firstName, lastName, ...instructorInfo } = data;
        const {
            dialCode,
            phoneNumber,
            ...remain
        } = instructorInfo;
        const { profile } = user;
        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                role,
                profile: {
                    upsert: {
                        create: {
                            avatarUrl,
                            firstName,
                            lastName,
                            phoneNumber,
                            dialCode,
                            instructorId: instructorProfile?.id,
                            tutorId: tutorProfile?.id,
                            isApproved: false,
                        },
                        update: {
                            avatarUrl,
                            firstName,
                            lastName,
                            phoneNumber,
                            dialCode,
                            instructorId: instructorProfile?.id,
                            tutorId: tutorProfile?.id,
                        },
                    },
                },
            },
        });
        if (!updatedUser) throw new InternalServerErrorException();

    }

    async createInstructorOrTutorProfile(  
        user: any,
        data: BaseProfileDto,
        profileData: BaseProfileDto,
        isRegister = false,
        updateUser = true){

        await this._createProfileIfNotExists(user.id, profileData);
        const  { updatedInstructor, updatedTutor } =  await this.changeInstructorOrTutorProfile(user, data, isRegister, updateUser);
        await this._updateInstructorId(user.id, updatedInstructor.id);
        return {
            updatedInstructor, updatedTutor 
        }; 

    }

    async _updateInstructorId(userId: string, instructorId: number) {
        await this.prisma.profile.update({
            where: {
                userId: userId, 
            },
            data: {
                instructorId: instructorId,
            },
        });
    }
    

    async changeInstructorOrTutorProfile(
        user: any,
        data: BaseProfileDto,
        isRegister = false,
        updateUser = true
    ) {
        const foundUser: any = await this.getUserDetail(user.id);
        if (!foundUser.isVerified && !isRegister)
            throw new ForbiddenException('Account is not verified!');

        const { role, avatarUrl, firstName, lastName, ...instructorInfo } = data;
        const {
            languageCodes,
            teachLanguages,
            dialCode,
            phoneNumber,
            ...remain
        } = instructorInfo;
        const { profile } = foundUser;

        const _newProfile = {
            languagesSpoken: {
                connect: languageCodes.map((l) => ({
                    code: l,
                })),
            },
            teachLanguages,
            ...remain,
        };

        const {updatedInstructor, updatedTutor} = await this._upsertInstructorTutorProfile(user.id, data);



        if(updateUser){
            this._updateUser(data, foundUser, updatedInstructor, updatedTutor);
        }
        return {
            updatedInstructor, updatedTutor 
        };
    }

    async handleUpsertInstructorProfile(instructorId: number, newProfile: any) {
        const updatedInstructor = await this.prisma.instructor.upsert({
            create: {
                ...newProfile,
                teachLanguages: {
                    connect: newProfile?.teachLanguages.map((l) => ({
                        id: l,
                    })),
                },
            },
            update: {
                ...newProfile,
                teachLanguages: {
                    set: newProfile?.teachLanguages.map((l) => ({
                        id: l,
                    })),
                },
            },
            where: {
                id: instructorId,
            },
        });

        if (!updatedInstructor) throw new InternalServerErrorException();
        return updatedInstructor;
    }

    async handleUpsertTutorProfile(tutorId: number, newProfile: any) {
        const updatedTutor = await this.prisma.tutor.upsert({
            create: {
                ...newProfile,
                teachLanguages: {
                    connect: newProfile?.teachLanguages.map((l) => ({
                        id: l,
                    })),
                },
            },
            update: {
                ...newProfile,
                teachLanguages: {
                    set: newProfile?.teachLanguages.map((l) => ({
                        id: l,
                    })),
                },
            },
            where: {
                id: tutorId,
            },
        });

        if (!updatedTutor) throw new InternalServerErrorException();
        return updatedTutor;
    }

    
    async findAllInstructors(
        subdomainId: string,
        {
            skip,
            take,
            cursorId,
            name: contains,
            sortBy,
            sortDesc,
        }: FindInstructorDto
    ) {
        return this.prisma.instructor.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                profile: {
                    OR:
            contains &&
            searchWithKeys(['firstName', 'lastName'], contains, 'insensitive'),
                    user: {
                        subdomainId,
                        isDeleted: false,
                    },
                },
            },
            include: {
                profile: true,
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
    }

    async findAllInstructorsPublic(
        subdomainId: string,
        {
            skip,
            take,
            cursorId,
            name: contains,
            sortBy,
            sortDesc,
        }: FindInstructorDto
    ) {
        return this.prisma.instructor.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                profile: {
                    OR:
            contains &&
            searchWithKeys(['firstName', 'lastName'], contains, 'insensitive'),
                    user: {
                        subdomainId,
                        isDeleted: false,
                        isVerified: true,
                        status: {
                            in: [UserStatus.ACTIVE, UserStatus.APPROVED],
                        },
                    },
                },
            },
            include: {
                profile: true,
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });
    }

    async findAllTutorsPublic(
        subdomainId: string,
        { skip, take, cursorId, name: contains, sortBy, sortDesc }: FindTutorDto
    ) {
        const where = {
            profile: {
                OR:
          contains &&
          searchWithKeys(['firstName', 'lastName'], contains, 'insensitive'),
                user: {
                    subdomainId,
                    isDeleted: false,
                    isVerified: true,
                    status: {
                        in: [UserStatus.ACTIVE, UserStatus.APPROVED],
                    },
                },
            },
        };

        const total = await this.prisma.tutor.count({
            where,
        });

        const tutors = await this.prisma.tutor.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where,
            include: {
                profile: true,
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                }
                : {
                },
        });

        return {
            tutors,
            total,
        };
    }

    async approveInstructor(
        { userId, isApproved }: ApproveInstructorDto,
        subdomainId: string
    ) {
        const user = await this.findById(userId);

        const { role, email, profile } = user;
        if (user.role !== Role.INSTRUCTOR && user.role !== Role.TUTOR)
            throw new InternalServerErrorException();
        await this.prisma.profile.update({
            where: {
                userId,
            },
            data: {
                isApproved,
            },
        });

        if (isApproved) {
            this._sendAcceptanceEmail(email, subdomainId, {
                role,
                firstName: profile.firstName,
            });
        } else {
            this._sendReapplicationEmail(email, subdomainId, {
                role,
                firstName: profile.firstName,
            });
        }
    }

    async _sendAcceptanceEmail(
        email: string,
        subdomainId: string,
        { role, firstName }
    ) {
        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const acceptancePath = join(
            __dirname,
            './../../../client/html/acceptance-email.html'
        );
        let btnMsg = 'Start Creating';
        let msg = 'Happy Teaching';
        let teamName = 'instructor';

        switch (role) {
        case Role.TUTOR:
            btnMsg = 'Start Tutoring';
            msg = 'Happy Tutoring';
            teamName = 'tutor';
            break;
        }

        const subdomainUrl = await getSubdomainUrl(this.db, subdomainId);

        const body = _emailHelper.buildStringTemplate(acceptancePath, {
            firstName,
            btnMsg,
            btnLink: `${subdomainUrl}/instructor`,
            dashboardLink: `${subdomainUrl}/instructor`,
            teamName,
            email,
            msg,
        });

        _emailHelper.send(email, 'Welcome to David@Immersio', templatePath, {
            body,
            email,
            year: new Date().getFullYear(),
            subdomain: subdomainUrl,
        });
    }

    async _sendReapplicationEmail(
        email: string,
        subdomainId: string,
        { role, firstName }
    ) {
        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const reapplicationPath = join(
            __dirname,
            './../../../client/html/reapplication-email.html'
        );

        const btnMsg = 'Reapply';
        const msg = 'We\'ll connect soon,';
        let teamName = 'an Instructor';

        switch (role) {
        case Role.TUTOR:
            teamName = 'a Tutor';
            break;
        }

        const subdomainUrl = await getSubdomainUrl(this.db, subdomainId);

        const body = _emailHelper.buildStringTemplate(reapplicationPath, {
            firstName,
            btnMsg,
            btnLink: `${subdomainUrl}/teach`,
            teamName,
            msg,
        });

        _emailHelper.send(email, 'Please reapply', templatePath, {
            body,
            email,
            year: new Date().getFullYear(),
            subdomain: subdomainUrl,
        });
    }

    async uploadAvatar(file: Express.Multer.File) {
        const { buffer, originalname } = file;
        const s3Name = uuid();

        const resizedImage = await sharp(buffer, {
            limitInputPixels: false,
        })
            .resize({
                width: 255,
                height: 255,
                withoutEnlargement: true,
                fit: 'inside',
            })
            .webp()
            .toBuffer();

        // const type: FileType = FileType.AVATAR;

        const uploadResult = await s3
            .upload({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Body: resizedImage,
                Key: `${s3Name}.webp`,
                ACL: 'public-read',
            })
            .promise();
        // const ext = getFileExtension(originalname);

        try {
            
            return {
                avatarUrl: uploadResult.Location,
            };
        } catch (error) {
            throw new InternalServerErrorException('Upload file failed');
        }
    }

    async getAvatarUrl(userId: string, avatarId: string) {
        try {
            const file = await this.prisma.file.findUnique({
                where: {
                    id: avatarId,
                },
            });
            if (file.userId !== userId) throw new ForbiddenException();
            return s3.getSignedUrlPromise('getObject', {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: file.s3Key,
            });
        } catch {
            return null;
        }
    }

    async checkUserActive(id: string) {
        const user = await this.db
            .selectFrom('User')
            .where('id', '=', id)
            .select('isActive')
            .executeTakeFirst();
        if (!user || !user.isActive) {
            return false;
        }
        return true;
    }
}
