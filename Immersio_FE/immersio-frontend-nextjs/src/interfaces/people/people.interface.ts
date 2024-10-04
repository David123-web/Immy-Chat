import { ROLE_TYPE } from '../auth/auth.interface';
import { IGetCommonDataRequest, Option } from '../common/common.interface';
import { IHeaderTable } from '../mydrive/mydrive.interface';
export interface IListRoleManagementResponse<T = any> {
	id: string;
	name: string;
	role: ROLE_TYPE;
	value: { [key: string]: boolean };
}

export interface IUpdatePermissionRequest {
	id: string;
	value: {
		[key: string]: boolean;
	};
}

interface ITeachLanguages {
	name: string;
	id: number;
}

export interface IProfileUserManagement {
	firstName: string;
	lastName: string;
	description: string;
	address: string;
	avatarUrl: string;
	dob: string;
	gender: string;
	dialCode: string;
	phoneNumber: string;
	socialLinks: ISocialLinks;
	tutor?: {
		id: number;
		hourRate: number;
		teachLanguages: ITeachLanguages[];
	};
	instructor?: {
		id: number;
		hourRate: number;
		teachLanguages: ITeachLanguages[];
	};
	student?: {
		id: number;
		parentDialCode?: string;
		parentEmail?: string;
		parentFirstName?: string;
		parentLastName?: string;
		parentPhoneNumber?: string;
	};
}

export interface IUserManagement {
	id: string;
	email: string;
	isVerified: boolean;
	isActive: boolean;
	role: string;
	createdAt: Date;
	updatedAt: Date;
	profile: IProfileUserManagement;
	status: UserStatus;
}

export type TUserSearchBy = Pick<
	IUserManagement & IProfileUserManagement,
	'email' | 'phoneNumber' | 'firstName' | 'lastName'
>;

export interface IListUserByRoleRequest extends IGetCommonDataRequest<TUserSearchBy> {
	role: ROLE_TYPE;
}

export interface IListUserByRoleResponse {
	users: IUserManagement[];
	total: number;
}

export interface IUpdateAccountStatusRequest {
	id: string;
	status: UserStatus;
}

export interface ISocialLinks {
	facebook: string;
	twitter: string;
	youtube: string;
	linkedin: string;
	instagram: string;
}

export interface IUpdateUserSocialRequest extends ISocialLinks {
	id: string;
}

export interface IAddUpdateTeacherRequest {
	avatarUrl: string;
	email: string;
	firstName: string;
	lastName: string;
	timezone: string;
	status: UserStatus;
	dialCode: string;
	phoneNumber: string;
	address: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
	hourRate: number;
	teachLanguages: string[];
	languageCodes: string[];
	qualificationDesc: string;
	experienceDesc: string;
	bio: string;
	classTagIds: string[];
}

export interface IAddUpdateStudentRequest {
	avatarUrl: string;
	email: string;
	firstName: string;
	lastName: string;
	timezone: string;
	status: string;
	dialCode: string;
	phoneNumber: string;
	address: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
	languageCodes: string[];
	learningLanguages: string[];
	parentFirstName: string;
	parentLastName: string;
	parentEmail: string;
	parentDialCode: string;
	parentPhoneNumber: string;
	classTagIds: string[];
}

export interface IAddUpdateEditorCSRequest {
	avatarUrl: string;
	email: string;
	firstName: string;
	lastName: string;
	timezone: string;
	status: string;
	dialCode: string;
	phoneNumber: string;
	address: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
	emailNotificationOptions: EmailNotificationType[];
	classTagIds: string[]; //ONLY CS
}

export interface IUpdateUserById<T = any> {
	id: string;
	data: T;
}

export interface IInviteInterviewRequest {
	id: string;
	content: string;
}

export enum EmailNotificationType {
	SUBSCRIPTION_UPDATE = 'SUBSCRIPTION_UPDATE',
	BOOKING_ENQUIRY = 'BOOKING_ENQUIRY',
	STUDENT_AUTO_CHARGE = 'STUDENT_AUTO_CHARGE',
	PAYMENT_ORDER_PAYOUT_LATE_FAILURE = 'PAYMENT_ORDER_PAYOUT_LATE_FAILURE',
	INSTRUCTOR_DATA_DELETION_REQUEST = 'INSTRUCTOR_DATA_DELETION_REQUEST',
	WEEKLY_UPDATE = 'WEEKLY_UPDATE',
}

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	DORMANT = 'DORMANT',
}

export const TEACHER_STATUS_OPTIONS: Option<UserStatus>[] = [
	{
		label: 'Approved',
		value: UserStatus.APPROVED,
	},
	{
		label: 'Dormant',
		value: UserStatus.DORMANT,
	},
	{
		label: 'Pending',
		value: UserStatus.PENDING,
	},
	{
		label: 'Rejected',
		value: UserStatus.REJECTED,
	},
];

export const STUDENT_STATUS_OPTIONS: Option<UserStatus>[] = [
	{
		label: 'Activate',
		value: UserStatus.ACTIVE,
	},
	{
		label: 'Deactivate',
		value: UserStatus.INACTIVE,
	},
];

export const RECEIVED_EMAILS_OPTIONS: Option<EmailNotificationType>[] = [
	{
		label: 'Subscription Update Notifications',
		value: EmailNotificationType.SUBSCRIPTION_UPDATE,
	},
	{
		label: 'Booking Enquiry Notifications',
		value: EmailNotificationType.BOOKING_ENQUIRY,
	},
	{
		label: 'Student Auto-change Notifications',
		value: EmailNotificationType.STUDENT_AUTO_CHARGE,
	},
	{
		label: 'Payment Order payout late failure',
		value: EmailNotificationType.PAYMENT_ORDER_PAYOUT_LATE_FAILURE,
	},
	{
		label: 'Instructor data deletion requests',
		value: EmailNotificationType.INSTRUCTOR_DATA_DELETION_REQUEST,
	},
	{
		label: 'Weekly update Notifications',
		value: EmailNotificationType.WEEKLY_UPDATE,
	},
];

export const columns: IHeaderTable<IUserManagement & { tools: string; fullName: string } & IProfileUserManagement>[] = [
	{
		label: 'Image',
		key: 'avatarUrl',
		widthGrid: '100px',
	},
	{
		label: 'Email',
		key: 'email',
		widthGrid: '150px',
	},
	{
		label: 'Full name',
		key: 'fullName',
		widthGrid: '120px',
	},
	{
		label: 'Phone number',
		key: 'phoneNumber',
		widthGrid: '150px',
	},
	{
		label: 'Email status',
		key: 'isVerified',
	},
	{
		label: 'Account status',
		key: 'status',
	},
	{
		label: 'Actions',
		key: 'tools',
	},
];

export const columnsStudent: IHeaderTable<
	IUserManagement & { tools: string; fullName: string } & IProfileUserManagement &
		Pick<IProfileUserManagement['student'], 'parentPhoneNumber' | 'parentEmail'>
>[] = [
	{
		label: 'Image',
		key: 'avatarUrl',
		widthGrid: '100px',
	},
	{
		label: 'Email',
		key: 'email',
		widthGrid: '150px',
	},
	{
		label: 'Full name',
		key: 'fullName',
		widthGrid: '150px',
	},
	{
		label: 'Phone number',
		key: 'phoneNumber',
		widthGrid: '150px',
	},
	{
		label: "Parent's email",
		key: 'parentEmail',
		widthGrid: '200px',
	},
	// {
	// 	label: "Parent's phone number",
	// 	key: 'parentPhoneNumber',
	// 	widthGrid: '150px',
	// },
	{
		label: 'Account status',
		key: 'status',
	},
	{
		label: 'Actions',
		key: 'tools',
	},
];

export const searchUserOptions: Option<keyof TUserSearchBy>[] = [
	{
		value: 'email',
		label: 'Email',
	},
	{
		value: 'firstName',
		label: 'First Name',
	},
	{
		label: 'Last Name',
		value: 'lastName',
	},
	{
		label: 'Phone Number',
		value: 'phoneNumber',
	},
];

export interface IClassTagsTable {
	name: string;
	description: string;
	connections: React.ReactNode;
}

export interface ICreateClassTagRequest {
	name: string;
	description: string;
}

export interface IUpdateClassTagRequest extends ICreateClassTagRequest {
	id: string;
}

export const searchClassTagsOptions: Option<keyof IClassTagsTable>[] = [
	{
		value: 'name',
		label: 'Name',
	},
	{
		value: 'description',
		label: 'Description',
	},
	{
		value: 'connections',
		label: 'Connections',
	},
];

export interface IGetClassTagsResponse {
	total: number;
	data: {
		id: string;
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		connections: {
			instructor: number;
			tutor: number;
			student: number;
			customer_service: number;
		};
	}[];
}

export interface IGetUsersByClassTagResponse {
	id: string;
	email: string;
	subdomainId: string;
	role: ROLE_TYPE;
	profile: {
		id: number;
		userId: string;
		firstName: string;
		lastName: string;
		studentId?: number;
		tutorId?: number;
	};
}

export interface CreateAvailabilityTimeRequest {
	userId: string;
	availableTimes: AvailableTime[];
	deleteIds: number[];
}

export interface AvailableTime {
	start: string;
	repeat: AvailableTimeRepeat | null;
}

export enum DayOfWeek {
	MON = 'MON',
	TUE = 'TUE',
	WED = 'WED',
	THU = 'THU',
	FRI = 'FRI',
	SAT = 'SAT',
	SUN = 'SUN',
}

export enum RepeatType {
	DAY = 'DAY',
	WEEK = 'WEEK',
	MONTH = 'MONTH',
}

export interface AvailableTimeRepeat {
	amount: number;
	dayOfWeeks: DayOfWeek[];
	type: RepeatType;
	end: string | null;
	dateExceptions: Date[];
	occurrence?: number;
}

export interface IGetAvailableTimesRequest {
	start: string;
	end: string;
	userId: string;
}

export interface IGetAvailableTimesResponse {
	id: number;
	start: string;
	createdAt: string;
	updatedAt: string;
	isDeleted: boolean;
	deletedAt: null;
	userId: string;
	repeat: null;
}

export interface ResendVerifyEmailRequest {
	userId: string;
}

export interface ImportInstructorsRequest {
	avatarUrl: string;
	dialCode: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	hourRate: string;
	teachLanguages: string;
	languageSpoken: string;
	timeZone: string;
	accountStatus: string;
	address: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
	qualification: string;
	teachingExperience: string;
	bio: string;
	classTag: string;
	file: any;
}

export interface ImportInstructorsResponse {
	first_name: string;
	last_name: string;
	email: string;
	country_code: string;
	phone_number: string;
	hourly_rate: string;
	language_teaching: string;
	language_spoken: string;
	class_tag: string;
	time_zone: string;
	account_status: string;
	avatar_url: string;
	address: string;
	zipcode: string;
	city: string;
	state: string;
	country: string;
	qualification: string;
	teaching_experience: string;
	bio: string;
	success: boolean;
	error: string;
}

export interface ReportItem {
	name: string;
	errors: string[];
}