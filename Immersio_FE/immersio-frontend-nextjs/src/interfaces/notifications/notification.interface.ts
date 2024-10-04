export interface IRegisterNotificationsRequest {
	deviceId: string;
	token: string;
}

export interface IGetListNotificationsRequest {
	take?: number;
	skip?: number;
}

export interface IGetListNotificationsResponse {
	id: string;
	userId: string;
	body: string;
	seen: boolean;
	type: NOTIFICATION_TYPE;
	updatedAt: Date;
	createdAt: Date;
	disabled: boolean;
	metadata: IInviteAsCointructorMetaData | ISubmitBookingRequestMetaData;
}

export enum NOTIFICATION_TYPE {
	INVITE_AS_COINSTRUCTOR = 'INVITE_AS_COINSTRUCTOR',
	SUBMIT_BOOKING_REQUEST = 'SUBMIT_BOOKING_REQUEST',
}

export interface ISeenNotificationRequest {
	listId: string[];
}

export interface IInviteAsCointructorMetaData {
	courseId: {
		id: number;
		name: string;
	};
	profile: {
		avatarUrl: string;
		firstName: string;
		lastName: string;
	};
	token: string;
}
export interface ISubmitBookingRequestMetaData {
	classBookingId: number;
	bookingRequestId: number;
	student: {
		id: number;
		profile: {
			id: number;
			dob: null;
			city: null;
			state: null;
			fileId: null;
			gender: string;
			userId: string;
			address: null;
			country: null;
			tutorId: null;
			zipCode: null;
			dialCode: null;
			editorId: null;
			lastName: string;
			timezone: null;
			avatarUrl: string;
			createdAt: Date;
			firstName: string;
			studentId: number;
			updatedAt: Date;
			isApproved: boolean;
			description: null;
			phoneNumber: string;
			socialLinks: string;
			currencyCode: null;
			instructorId: null;
			languageCode: null;
			customerServiceId: null;
		};
	};
}
