import { IPostProfileTeacher } from '../user/user.interface';

export enum SocialMediaType {
	FACEBOOK = 'FACEBOOK',
	GOOGLE = 'GOOGLE',
}

export enum ROLE_TYPE {
	SUBDOMAIN_ADMIN = 'SUBDOMAIN_ADMIN',
	INSTRUCTOR = 'INSTRUCTOR',
	TUTOR = 'TUTOR',
	STUDENT = 'STUDENT',
	EDITOR = 'EDITOR',
	SUPER_ADMIN = 'SUPER_ADMIN',
	CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}

export enum PERMISSION_TYPE {
	'Course_Creator_List' = 'Course_Creator_List',
	'Course_Creator_Step1' = 'Course_Creator_Step1',
	'Course_Creator_Step2' = 'Course_Creator_Step2',
	'Course_Creator_Step3' = 'Course_Creator_Step3',
	'Course_Creator_Tags' = 'Course_Creator_Tags',
	'People_Instructors' = 'People_Instructors',
	'People_Tutors' = 'People_Tutors',
	'People_Students' = 'People_Students',
	'People_Editors' = 'People_Editors',
	'People_CSRReps' = 'People_CSRReps',
	'People_Role_Settings' = 'People_Role_Settings',
	'Tutor_Match_Classes' = 'Tutor_Match_Classes',
	'Tutor_Match_Tutors' = 'Tutor_Match_Tutors',
	'Tutor_Match_Reviews' = 'Tutor_Match_Reviews',
	'Tutor_Match_Reports' = 'Tutor_Match_Reports',
	'Tutor_Match_Campus' = 'Tutor_Match_Campus',
	'Tutor_Match_Invoices' = 'Tutor_Match_Invoices',
	'Student_Recordings' = 'Student_Recordings',
	'ImmyChat_Chatbot' = 'ImmyChat_Chatbot',
	'Payment_gateways' = 'Payment_gateways',
	'Payment_logs' = 'Payment_logs',
	'Blog_Management' = 'Blog_Management',
	'FAQ_Management' = 'FAQ_Management',
	'Banner_Management' = 'Banner_Management',
	'Basic_settings' = 'Basic_settings',
	'Edit_profile' = 'Edit_profile',
	'Change_password' = 'Change_password',
	'Subscription_Coupons' = 'Subscription_Coupons',
	'Subscription_Course' = 'Subscription_Course',
	'Subscription_Tutors' = 'Subscription_Tutors',
	'MyDrive_Management' = 'MyDrive_Management',
	// 'Blog_Management_Categories' = 'Blog_Management_Categories',
	// 'Blog_Management_Blog' = 'Blog_Management_Blog',
	// 'FAQ_Management_Categories' = 'FAQ_Management_Categories',
	// 'FAQ_Management_FAQs' = 'FAQ_Management_FAQs',
	'People_Class_Tags' = 'People_Class_Tags',
	'Settings_Theme_Logo' = 'Settings_Theme_Logo',
	'Settings_Information' = 'Settings_Information',
	'Settings_Social_Media' = 'Settings_Social_Media',
	'Settings_Email' = 'Settings_Email',
}

export interface IRegisterRequest {
	email: string;
	firstName?: string;
	lastName?: string;
	password: string;
	role: ROLE_TYPE;
}

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface ILoginResponse {
	accessToken: string;
	createdAt: Date;
	email: string;
	id: string;
	isVerified: boolean;
	password: string;
	role: ROLE_TYPE;
	socialAuthenId: string | null;
	subdomainId: string | null;
	updatedAt: Date;
}

export interface ILoginThirdPartyRequest {
	role: string;
	socialId: string;
	socialType: SocialMediaType;
	accessToken: string;
	firstName: string;
	lastName: string;
}

export interface IVerifyRequest {
	accessToken: string;
}

export interface IEmailVerifyRequest {
	token: string;
}

export interface IForgotPasswordRequest {
	email: string;
}

export interface ISendMagicLinkRequest {
	email: string;
}

export interface IVerifyMagicLinkRequest {
	token: string;
}

export interface IResetPasswordRequest {
	newPassword: string;
	token: string;
}

export interface IRegisterTeacherRequest extends IPostProfileTeacher {
	email: string;
	password: string;
}

export interface ICheckExistEmailRequest {
	email: string;
}
