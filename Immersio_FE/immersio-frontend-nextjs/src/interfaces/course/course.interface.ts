import { IGetCommonDataRequest } from '../common/common.interface';

export interface IGetCourseLanguagesResponse {
	id: number;
	name: string;
	code: string;
	isDeleted: boolean;
	isApproved: boolean;
	deletedAt: null;
	createdAt: string;
	updatedAt: string;
}

export interface IAcceptRejectNotificationRequest {
	token: string;
}

export interface IDeleteCoInstructorRequest {
	courseId: number;
	instructorId: number;
}

export interface Section {
	id: number;
	index: number;
	courseId: number;
	userId: string;
	title: string;
	isDeleted: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
	lessons: Lesson[];
	course: Course;
}

export interface Course {
	id: number;
	levelId: number;
	instructorId: number;
	courseLanguageId: number;
	price: number;
	strikePrice: number;
	slug: string;
	userId: string;
	subdomainId: string;
	thumbnailId: string;
	instructionVideoId: string;
	title: string;
	description: string;
	learningOutcome: string;
	requirement: string;
	isPublished: boolean;
	isFree: boolean;
	isDeleted: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
	instructor?: Instructor;
	sections?: Section[];
	coInstructors?: any[];
	instructionVideo?: InstructionVideo;
	thumbnail?: Thumbnail;
	tags?: Tag[];
	_count?: Count;
}

export interface Lesson {
	id: number;
	classBookingId: null;
	courseSectionId: number;
	subdomainId: string;
	thumbnailId: null;
	instructionVideoId: null;
	index: number;
	title: string;
	userId: string;
	context: null;
	introduction: null;
	isFree: boolean;
	isDeleted: boolean;
	deletedAt: null;
	createdAt: Date;
	updatedAt: Date;
}

export interface Count {
	sections: number;
}

export interface InstructionVideo {
	id: string;
	ext: string;
	name: string;
	token: null;
	s3Key: string;
	userId: string;
	folderId: string;
	s3Location: string;
	externalLink: null;
	size: number;
	metadata: null;
	public: boolean;
	type: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Instructor {
	id: number;
	title: null;
	bio: string;
	website: null;
	countryCode: string;
	experienceDesc: string;
	qualificationDesc: string;
	relatedMaterialDesc: string;
	proficiencyLevelCode: string;
	hourRate: number;
	amountPaid: null;
	updatedAt: Date;
	createdAt: Date;
}

export interface Tag {
	id: number;
	name: string;
	userId: null;
	description: null;
	hexColor: null;
	isDeleted: boolean;
	deletedAt: null;
	updatedAt: Date;
	createdAt: Date;
}

export interface Thumbnail {
	id: string;
	s3Key: string;
	userId: string;
	fileId: string;
	s3Location: string;
	public: boolean;
	updatedAt: Date;
	createdAt: Date;
}

export interface ImportStep1Request {
	file: any;
}

export interface ImportStep1Response {
	course_title: string;
	course_description: string;
	course_outcome: string;
	course_requirement: string;
	course_tag: string;
	course_price: string;
	course_language: string;
	course_level: string;
	course_image_url: string;
	course_video_url: string;
	section_title: string;
	lesson_title: string;
	_sections: {
		section_title: string;
		_lessons: {
			lesson_title: string;
		}[];
	}[];
	success: boolean;
	error: string;
}

export interface ImportStep2Request {
	data: any;
}

export interface ImportStep2Response {
	sections: Section[];
}

export interface Section {
	course_section: string;
	lesson_title: string;
	lesson_introduction: string;
	lesson_video_url: string;
	dialogue_context: string;
	character_name: string;
	dialogue_text: string;
	dialogue_audio_url: string;
	_lessons: {
		lesson_title: string;
		lesson_introduction: string;
		lesson_video_url: string;
		_dialogs: {
			dialogue_context: string;
			_lines: {
				character_name: string;
				dialogue_text: string;
				dialogue_audio_url: string;
			}[];
		}[];
	}[];
	success: boolean;
	error: string;
}
[];

export type TGetListPaidCoursesSearchBy = { title: string };

export interface IGetListPaidCoursesRequest extends IGetCommonDataRequest<TGetListPaidCoursesSearchBy> {}

export interface IGetListPaidCoursesResponse extends Course {
	// total: number;
	// data: Course[];
}
