import { IGetCommonDataRequest, Option } from '../common/common.interface';
import { AvailableTime, RepeatType } from '../people/people.interface';

export enum PLAN_STATUS {
	PUBLISH = 'PUBLISH',
	PRIVATE = 'PRIVATE',
}

export enum TUTORING_CREDIT_PACKAGE_STATUS {
	ACITVE = 'Active',
	DEACTIVE = 'Deactive',
}

export enum TUTOR_DRILL_TYPE {
	FLASH_CARD = 'FLASH_CARD',
	DRAG_AND_DROP = 'DRAG_AND_DROP',
	DRAG_THE_WORDS = 'DRAG_THE_WORDS',
	MULTIPLE_CHOICES = 'MULTIPLE_CHOICES',
	LISTEN_AND_FILL_BLANKS = 'LISTEN_AND_FILL_BLANKS',
	SORT_THE_PARAGRAPH = 'SORT_THE_PARAGRAPH',
}

export enum EventCalendarType {
	Meeting = 'Meeting',
	Holiday = 'Holiday',
	Birthday = 'Birthday',
}

export enum TUTOR_CONFIRMATION {
	CONFIRMED = 'Confirmed',
	PENDING = 'Pending',
}

export enum CLASS_STATUS {
	PENDING = 'Pending',
	COMPLETED = 'Completed',
	ON_GOING = 'On going',
}

export enum CAMPUS_STATUS {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum BOOKING_CONFIRMATION {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	REJECTED = 'REJECTED',
}

/* ------------------------------- TUTOR PLANS ------------------------------ */
export interface ITutorPlansTable {
	title: string;
	tutors: string;
	status: string;
}

export interface ITutorPlan {
	id: string;
	title: string;
	calendarColour: string;
	description: string;
	status: string;
	courseLanguageId: number;
	courseId: number;
	isDeleted: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
	subdomainId: string;
	tutors: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	}[];
	students: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	}[];
}

export interface IListTutorPayment {
	transactionId: string;
	requestedTutor: string;
	amount: string;
	description: string;
	requestedOn: string;
	info: string;
	process: string;
}

/* ------------------------------ TUTOR CLASSES ----------------------------- */
export interface ITutorClassesTable {
	id: string;
	datetime: string;
	students: string;
	tutors: string;
	tutorConfirmation: TUTOR_CONFIRMATION;
	hours: number;
	status: CLASS_STATUS;
}

export interface IListTutoringCreditPackage {
	title: string;
	price: string;
	creditValue: string;
	status: TUTORING_CREDIT_PACKAGE_STATUS;
}

export interface ICreateUpdateCreditPlanForm {
	title: string;
	price: number;
	creditValue: number;
	isActive: boolean;
}

export interface UserProfile {
	id: number;
	profile: {
		firstName: string;
		lastName: string;
	};
}

export interface Language {
	id: number;
	name: string;
	isDeleted: boolean;
	isApproved: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
}

export interface Course {
	id: number;
	courseLanguageId: number;
	language: Language;
	title: string;
	instructor: UserProfile;
	level: {
		id: number;
		name: string;
	};
	sections: { _count: { lessons: number } }[] | Section[];
}

export interface Section {
	title: string;
	index: number;
	id: number;
	lessons: Lesson[];
}

export interface Lesson {
	title: string;
	id: number;
	index: number;
	tutoringMaterials: any[];
	drills: IAddDrillForm[];
}

export interface IAddPlanForm {
	title: string;
	language: number;
	course: number;
	calendarColour: string;
	description: string;
	status: PLAN_STATUS;
	students: number[];
	tutors: number[];
	classTags: string[];
}

/* ------------------------------ TUTOR DRILLS ------------------------------ */
export interface IPlanDrill {
	id: string;
	instruction: string;
	lessonId: number;
	index: number;
	sectionType: string;
	data: IDrillData[];
	type: TUTOR_DRILL_TYPE;
	parentId: string;
}

export interface IAddDrillForm {
	instruction: string;
	lessonId: number;
	index: number;
	sectionType: string;
	data: IDrillData[];
	type: TUTOR_DRILL_TYPE;
	parentId: string;
}

export interface IDrillData {
	id: string;
	index: number;
	question: string;
	content: string[];
	correctIndex: number;
	media: string;
	mediaUrl: string;
}

export interface IAddDrillRequest extends IAddDrillForm {}

export interface IUpdateDrillRequest extends IAddDrillForm {}

/* --------------------------- TUTOR MATCH REVIEWS -------------------------- */
export interface ITutorMatchReviewTable {
	review: string;
	createdAt: string;
	hours: number;
	rate: number;
}

export interface ITutorMatchReviewDetail {
	id: string;
	studentId: number;
	tutorId: number;
	rate: number;
	hours: number;
	details: string;
	createdAt: Date;
	isDeleted: boolean;
	student: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	};
	tutor: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	};
}

/* --------------------------- GET LIST OF REVIEWS -------------------------- */
export interface ITutorMatchReviewDetailResponse {
	total: number;
	data: ITutorMatchReviewDetail[];
}

export type TTutorMatchReviewDetailSearchBy = Pick<ITutorMatchReviewDetail, 'rate'>;

export interface ITutorMatchReviewDetailRequest extends IGetCommonDataRequest<TTutorMatchReviewDetailSearchBy> {}

/* --------------------------- TUTOR MATCH REPORTS -------------------------- */
export interface ITutorMatchReportTable {
	report: string;
	class: string;
	tutor: string;
	student: string;
	classDate: string;
	status: string;
}

/* ------------------------- TUTOR INVOICES ACCOUNT ------------------------- */
export interface ITutorMatchInvoiceAccountsTable {
	family: string;
	student: string;
	balance: number;
	autoInvoiceSettings: string;
}

/* ----------------------------- TUTOR INVOICES ----------------------------- */
export enum TutorInvoiceMode {
	Period = 'Period-Auto-invoice',
	Class = 'Class-Auto-invoice',
	Manual = 'Manual-invoice',
}
export interface ITutorMatchInvoicesTable {
	status: boolean; //enum
	invoice: string;
	invoiceDate: string;
	family: string;
	student: string;
	dateRange: string;
	mode: TutorInvoiceMode; // enum;
	amount: number;
}

export const CAMPUS_STATUS_OPTIONS: Option<CAMPUS_STATUS>[] = [
	{
		label: 'Activate',
		value: CAMPUS_STATUS.ACTIVE,
	},
	{
		label: 'Deactivate',
		value: CAMPUS_STATUS.INACTIVE,
	},
];

/* ------------------------------ TUTOR CAMPUS ------------------------------ */
export type IAddRoomInCampus = Omit<IAddRoomRequest, 'campusId'>;
export interface IAddCampusRequest extends IUpdateCampusRequest {
	rooms: IAddRoomInCampus[];
}

export interface IUpdateCampusRequest {
	name: string;
	dialogCode: string;
	phoneNumber: string;
	managerName: string;
	status: CAMPUS_STATUS;
	address: string;
	zipCode: string;
	city: string;
	state: string;
	dialCode: string;
	countryCode: string;
}

export interface IAddRoomRequest extends IUpdateRoomRequest {}
export interface IUpdateRoomRequest {
	roomId: string;
	campusId: string;
	deleteAvailableTimeIds: number[];
	availableTimes: AvailableTime[];
}

export interface ITutorMatchCampusTable {
	campus: string;
	location: string;
	manager: string;
	status: string;
}

export interface ICampusRoom {
	id: string;
	roomId: string;
	deleteAvailableTimeIds: number[];
	availableTimes: AvailableTime[];
}

export interface ICampus {
	id: string;
	subdomainId: string;
	name: string;
	countryCode: string;
	dialCode: string;
	phoneNumber: string;
	managerName: string;
	address: string;
	zipCode: string;
	city: string;
	state: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	isDeleted: boolean;
}

export interface IGetCampusResponse {
	total: number;
	data: ICampus[];
}

export interface IGetCampusByIdResponse extends ICampus {
	rooms: {
		id: string;
		roomId: string;
		campusId: string;
		createdAt: Date;
		updatedAt: Date;
	}[];
}
export interface IGetRoomByIdResponse {
	id: string;
	roomId: string;
	campusId: string;
	createdAt: Date;
	updatedAt: Date;
	availableTimes: AvailableTime[];
}

export interface IClassCampusRoom {
	id: string;
	roomId: string;
	campusId: string;
	createdAt: Date;
	updatedAt: Date;
	campus: ICampus;
}

export interface IGetRoomByIdRequest {
	id: string;
	start: string;
	end: string;
}

export interface IGetCampusByIdRespone {
	id: string;
	roomId: string;
	campusId: string;
	createdAt: Date;
	updatedAt: Date;
	campus: { subdomainId: string };
	availableTimes: any[];
}
/* ------------------------------ ADD NEW PLAN ------------------------------ */
export interface IAddPlansRequest extends IAddPlanForm {}

/* ------------------------------- UPDATE PLAN ------------------------------ */
export interface IUpdatePlansRequest extends IAddPlanForm {}

/* ------------------------- GET LIST OF TUTOR PLAN ------------------------- */
export interface IListTutorPlansResponse {
	total: number;
	plans: ITutorPlan[];
}

export type TTutorPlansSearchBy = Pick<ITutorPlansTable, 'title' | 'status' | 'tutors'>;

export interface IListTutorPlansRequest extends IGetCommonDataRequest<TTutorPlansSearchBy> {}

/* ------------------------- GET TUTORING PLAN BY ID ------------------------ */
export interface IGetTutorPlanByIdResponse {
	id: string;
	title: string;
	calendarColour: string;
	course: Course;
	description: string;
	drills: IPlanDrill[];
	status: string;
	courseLanguageId: number;
	courseId: number;
	isDeleted: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
	tutors: Tutor[];
	students: Student[];
	subdomainId: string;
	tutoringMaterials: IPlanMaterial[];
	classTags: {
		id: string;
		name: string;
		description: string;
		createdAt: Date;
		updatedAt: Date;
	}[];
}
export interface Student {
	id: number;
	parentFirstName: string;
	parentLastName: string;
	parentEmail: string;
	parentDialCode: string;
	parentPhoneNumber: string;
	amountPurchased: null;
	updatedAt: Date;
	createdAt: Date;
}

export interface Tutor {
	id: number;
	profileId: null;
	hourRate: number;
	amountPaid: null;
	title: string;
	bio: string;
	website: string;
	countryCode: string;
	experienceDesc: string;
	qualificationDesc: string;
	relatedMaterialDesc: string;
	proficiencyLevelCode: string;
	updatedAt: Date;
	createdAt: Date;
}

/* ----------------------------- UPLOAD MATERIAL ---------------------------- */
export type IUploadMaterialRequest = Omit<IFormAddMaterial, 'file'> & {
	fileId: string;
};

export interface IUploadMaterialResponse {}

/* ----------------------------- UPDATE MATERIAL ---------------------------- */
export interface IFormAddMaterial {
	lessonId: number;
	title: string;
	file: object;
	description: string;
	shareWithStudent: boolean;
	shareWithInstructor: boolean;
}

export interface IPlanMaterial {
	id: string;
	lessonId: number;
	title: string;
	description: string;
	fileId: string;
	shareWithStudent: boolean;
	shareWithInstructor: boolean;
	planId: string;
}

export type IUpdateMaterialRequest = Omit<IFormAddMaterial, 'lessonId' | 'file'> & {
	fileId: string;
};

export interface IUpdateMaterialResponse {}

/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */
/* ------------------------------- PRICE GROUP ------------------------------ */
export interface IFormPriceGroup {
	id: number;
	price: number;
}

/* ------------------------------ ADD NEW CLASS ----------------------------- */

export interface IAddClassForm {
	planId: string;
	startTime: Date;
	finishTime: Date;
	timezoneAbbr: string;
	topic: string;
	studentIds: string[];
	tutorId: string;
	studentChargeRateHour: number;
	//  {
	// 	studentNumber: number;
	// 	hourRate: number;
	// }[];
	tutorChargeRateHour: number;
	studentPremiumAmount: number;
	maxStudents: number;
	repeatType: RepeatType | null;
	repeatUntilDate: Date | null;
	repeatData: number | null;
	campusId: string;
	roomId: string;
	virtualClassLink: string;
	isRepeat: boolean;
	isPublic: boolean;
}

export interface IAddClassRequest extends IAddClassForm {}

export interface IUpdateClassRequest extends IAddClassForm {}

/* ------------------------ GET LIST OF TUTOR CLASSES ----------------------- */

export type TTutorClassesSearchBy = Pick<
	ITutorClassesTable,
	'id' | 'datetime' | 'students' | 'hours' | 'tutorConfirmation' | 'status' | 'tutors'
>;

export interface IListTutorClassesRequest extends IGetCommonDataRequest<TTutorClassesSearchBy> {}

export interface ITutorClass {
	id: number;
	topic: string;
	isPublic: boolean;
	isRepeat: boolean;
	campusId: null;
	bookingId: string;
	startTime: Date;
	finishTime: Date;
	timezoneAbbr: string;
	studentChargeRateHour: number;
	//  {
	// 	hourRate: number;
	// 	studentNumber: number;
	// }[];
	plan: ITutorPlan;
	tutorChargeRateHour: number;
	maxStudents: number;
	studentPremiumAmount: number;
	virtualClassLink: null;
	spaceAvailable: number;
	status: string;
	confirmation: string;
	students: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	}[];
	tutor: GetTutorInfoResponse;
	repeatType: RepeatType | null;
	repeatUntilDate: Date | null;
	repeatData: number | null;
}

export interface ITutorInfo {
	id: number;
	profile: {
		id: number;
		firstName: string;
		lastName: string;
		avatarUrl: string;
		city: string;
		country: string;
		state: string;
		description: string;
	};
}
export interface IListTutorClassResponse {
	total: number;
	data: ITutorClass[];
}

/* ----------------------------- GET CLASS BY ID ---------------------------- */
export interface IGetClassByIdResponse {
	id: number;
	referenceId: null;
	bookingId: string;
	confirmation: string;
	students: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	}[];
	tutor: {
		id: number;
		profile: {
			firstName: string;
			lastName: string;
		};
	};
	planId: string;
	status: string;
	updatedAt: Date;
	createdAt: Date;
	startTime: Date;
	finishTime: Date;
	timezoneAbbr: string;
	virtualClassLink: null;
	tutorChargeRateHour: number;
	studentChargeRateHour: number;
	//  {
	// 	studentNumber: number;
	// 	hourRate: number;
	// }[];
	isPublic: boolean;
	isRepeat: boolean;
	maxStudents: number;
	campusId: null;
	topic: string;
	studentPremiumAmount: number;
	availableTimeId: null;
}

/* ------------------------------ BOOKING CLASS ----------------------------- */
export interface IBookingClassRequest {
	classBookingId: number;
	tutorId: number;
	trialSession: Date;
	name: string;
	email: string;
	phoneNumber: string;
	aboutStudent: string;
}

/* ------------------------------- TUTOR INFO ------------------------------- */
export interface GetTutorInfoResponse {
	id: number;
	profile: Profile;
	hourRate: number;
	amountPaid: null;
	title: null;
	bio: string;
	website: null;
	countryCode: null;
	experienceDesc: string;
	qualificationDesc: string;
	relatedMaterialDesc: null;
	proficiencyLevelCode: null;
	updatedAt: Date;
	createdAt: Date;
	teachLanguages: LanguagesSpoken[];
	languagesSpoken: LanguagesSpoken[];
	country: null;
	proficiencyLevel: null;
	reviews: any[];
}

export interface LanguagesSpoken {
	id: number;
	name: string;
	code: string;
	isDeleted: boolean;
	isApproved: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
}

export interface Profile {
	id: number;
	userId: string;
	instructorId: null;
	avatarUrl: string;
	firstName: string;
	lastName: string;
	gender: string;
	dob: null;
	address: null;
	currencyCode: null;
	isApproved: boolean;
	updatedAt: Date;
	createdAt: Date;
	studentId: null;
	tutorId: number;
	socialLinks: string;
	editorId: null;
	customerServiceId: null;
	description: null;
	dialCode: string;
	phoneNumber: string;
	timezone: string;
	zipCode: null;
	city: null;
	state: null;
	country: null;
	fileId: null;
	languageCode: null;
}

/* -------------------------- GET CLASS ON CALENDAR ------------------------- */
export interface IGetClassCalendarRequest {
	startDate: string;
	endDate: string;
	tutorIds?: number[];
	classStatus?: string[];
	campusIds?: string[];
}

export interface CalendarClass extends ITutorClass {
	classBookingRequests: {
		id: number;
		tutor: ITutorInfo;
	};
}

/* ------------------------- HANDLE BOOKING REQUEST ------------------------- */
export interface HandleBookingRequest {
	requestId: number;
}

/* ---------------------------- COMPLETION CLASS ---------------------------- */
export interface GetLessonCompleteByClassIdRequest {
	classId: number;
}

export interface GetLessonCompleteByClassIdResponse {
	id: string;
	status: boolean;
	classBookingId: number;
	lessonId: number;
	userId: string;
}

export interface HandleCompleteClassRequest {
	classId: number;
	lessonId: number;
}
