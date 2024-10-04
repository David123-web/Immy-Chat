import { EmailNotificationType, ISocialLinks, UserStatus } from '../people/people.interface';
import { PERMISSION_TYPE, ROLE_TYPE } from '../auth/auth.interface';
import { IGetCommonDataRequest } from '../common/common.interface';

export enum USER_GENDER {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	OTHER = 'OTHER',
}
export interface ICurrentUser {
	id: string;
	email: string;
	isVerified: boolean;
	role: ROLE_TYPE;
	subdomainId: string | null;
	createdAt: string;
	updatedAt: string;
	socialAuthenId: string | null;
	profile: ICurrentUserProfile | null;
	roleProfile: IRoleProfile | null;
	accessToken: string;
	accesses?: Record<PERMISSION_TYPE, boolean> | null;
}

export interface ICurrentUserProfile {
	firstName: string;
	lastName: string;
	gender: string;
	dob: string | null;
	avatarId: string;
	phoneNumber: string;
	address: string | null;
	currencyCode: string | null;
	instructorId: number;
	createdAt: string;
	updatedAt: string;
	languagesSpoken: {
		code: string;
		name: string;
	}[];
	socialLinks: ISocialLinks;
	isApproved: boolean;
	avatarUrl: string | null;
}

export interface IRoleProfile {
	id: number;
	title: string;
	bio: string;
	hourRate: number;
	website: string;
	qualificationDesc: string;
	experienceDesc: string;
	relatedMaterialDesc: string;
	teachLanguages: { id: string; name: string }[];
	createdAt: string;
	updatedAt: string;
	proficiencyLevelCode: string;
	countryCode: string;
}

export interface IUploadAvatarResponse {
	avatarUrl: string;
}

export interface IPostProfileTeacher {
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	languageCodes: string[];
	website?: string;
	role: string;
	qualificationDesc: string;
	experienceDesc: string;
	teachLanguages: string[];
	avatarUrl?: string;
	bio: string;
	title?: string;
	hourRate?: number;
	dialCode: string
}

export interface IUpdateUserProfileForm {
	avatarUrl: string;
	firstName: string;
	lastName: string;
	bio: string;
	address: string;
	dob: Date;
	gender: string;
	phoneNumber: string;
	socialLinks: ISocialLinks | null;
	hourRate: number;
	teachLanguage: number[];
}

export interface IAssignTutor {
	id: number;
	profileId: string;
	hourRate: number;
	title: string;
	bio: string;
	website: string;
	countryCode: string;
	// languageCodes: string[];
	experienceDesc: string;
	qualificationDesc: string;
	relatedMaterialDesc: string;
	proficiencyLevelCode: string;
	updatedAt: Date;
	createdAt: Date;
	profile: IProfileAssignTutor;
}

export interface IProfileAssignTutor {
	id: number;
	userId: string;
	instructorId: string;
	avatarUrl: string;
	firstName: string;
	lastName: string;
	gender: string;
	dob: Date | string;
	address: string;
	currencyCode: string;
	languageCodes: string[];
	isApproved: boolean;
	updatedAt: Date;
	createdAt: Date;
	studentId: number;
	tutorId: number;
	socialLinks: string;
	editorId: number | string;
	customerServiceId: number | string;
	description: string;
	phoneNumber: string;
	fileId: number | string;
}

export interface IGetListTutorResponse {
	tutors: IAssignTutor[];
	total: number;
}
export interface IListTutorRequest extends IGetCommonDataRequest {}

export interface IGetUserByIdResponse {
	classTags: {
		id: string;
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
	}[];
	id: string;
	email: string;
	subdomainId: string;
	socialAuthenId: null;
	isDeleted: boolean;
	isVerified: boolean;
	isFirstTimeLogin: boolean;
	role: ROLE_TYPE;
	credit: number;
	stripeAccountId: null;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
	deletedAt: null;
	status: UserStatus;
	profile: {
		profileCompletion: number;
		instructorId: null;
		avatarUrl: string;
		firstName: string;
		lastName: string;
		gender: string;
		dob: null;
		address: string;
		currencyCode: null;
		languageCode: null;
		isApproved: boolean;
		updatedAt: Date;
		createdAt: Date;
		studentId: null;
		tutorId: null;
		editorId: null;
		customerServiceId: null;
		description: null;
		dialCode: string;
		phoneNumber: string;
		timezone: string;
		zipCode: string;
		city: string;
		state: string;
		country: string;
		fileId: null;
		socialLinks: ISocialLinks;
	};
	roleProfile: {
		amountPaid: number;
		amountPurchased: number;
		id: number;
		title: null;
		bio: string;
		website: null;
		countryCode: null;
		languagesSpoken: {
			code: string;
			name: string;
		}[];
		experienceDesc: string;
		qualificationDesc: string;
		relatedMaterialDesc: null;
		proficiencyLevelCode: string;
		hourRate: number;
		updatedAt: string;
		createdAt: string;
		teachLanguages: {
			id: number;
			name: string;
		}[];
		learningLanguages: {
			id: number;
			name: string;
		}[];
		parentDialCode: string;
		parentEmail: string;
		parentFirstName: string;
		parentLastName: string;
		parentPhoneNumber: string;
		emailNotificationOptions: EmailNotificationType[];
	};
	accesses: Record<PERMISSION_TYPE, boolean>;
}
