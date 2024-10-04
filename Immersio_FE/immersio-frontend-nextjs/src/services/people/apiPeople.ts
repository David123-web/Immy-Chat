import {} from '@/src/interfaces/auth/auth.interface';
import { IGetCommonDataRequest } from '@/src/interfaces/common/common.interface';
import {
	CreateAvailabilityTimeRequest as ICreateAvailabilityTimeRequest,
	IAddUpdateEditorCSRequest,
	IAddUpdateStudentRequest,
	IAddUpdateTeacherRequest,
	ICreateClassTagRequest,
	IInviteInterviewRequest,
	IListUserByRoleRequest,
	IUpdateAccountStatusRequest,
	IUpdateClassTagRequest,
	IUpdatePermissionRequest,
	IUpdateUserById,
	IUpdateUserSocialRequest,
	IGetAvailableTimesRequest,
	ResendVerifyEmailRequest,
	ImportInstructorsRequest,
} from '@/src/interfaces/people/people.interface';
import { http } from '../axiosService';

export async function getListRoleManagement() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management`);
}

export async function updatePermission(body: IUpdatePermissionRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/${body.id}`, {
		value: body.value,
	});
}

export async function getListUserByRole(params: IListUserByRoleRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/${params.role}`, params);
}

export async function updateAccountStatus(body: IUpdateAccountStatusRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user-status/${body.id}`, {
		status: body.status,
	});
}

export async function updateUsersSocial(body: IUpdateUserSocialRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/social/${body.id}`, {
		facebook: body.facebook,
		twitter: body.twitter,
		youtube: body.youtube,
		linkedin: body.linkedin,
		instagram: body.instagram,
	});
}

export async function addInstructor(body: IAddUpdateTeacherRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/INSTRUCTOR`, body);
}

export async function updateInstructor(body: IUpdateUserById<IAddUpdateTeacherRequest>) {
	return await http.patch(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/INSTRUCTOR/${body.id}`,
		body.data
	);
}

export async function addTutor(body: IAddUpdateTeacherRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/TUTOR`, body);
}

export async function updateTutor(body: IUpdateUserById<IAddUpdateTeacherRequest>) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/TUTOR/${body.id}`, body.data);
}

export async function addStudent(body: IAddUpdateStudentRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/STUDENT`, body);
}

export async function updateStudent(body: IUpdateUserById<IAddUpdateStudentRequest>) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/STUDENT/${body.id}`, body.data);
}

export async function addEditor(body: IAddUpdateEditorCSRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/EDITOR`, body);
}

export async function updateEditor(body: IUpdateUserById<IAddUpdateEditorCSRequest>) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/EDITOR/${body.id}`, body.data);
}

export async function addCustomerService(body: IAddUpdateEditorCSRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/CUSTOMER_SERVICE`, body);
}

export async function updateCustomerService(body: IUpdateUserById<IAddUpdateEditorCSRequest>) {
	return await http.patch(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/CUSTOMER_SERVICE/${body.id}`,
		body.data
	);
}

export async function deleteUser(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/${id}`);
}

export async function inviteForInterview(body: IInviteInterviewRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/user/invite-interview/${body.id}`, {
		content: body.content,
	});
}

export async function createClassTag(body: ICreateClassTagRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/class-tag`, body);
}

export async function getClassTags(params?: IGetCommonDataRequest<ICreateClassTagRequest>) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/class-tag/tags`, params);
}

export async function updateClassTag(body: IUpdateClassTagRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/class-tag/${body.id}`, body);
}

export async function deleteClassTag(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/class-tag/${id}`);
}

export async function getUsersInClassTag(data: { ids: string[] }) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/class-tag/users`, data);
}

export async function createAvailabilityTime(body: ICreateAvailabilityTimeRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/available-time`, body);
}

export async function getAvailabilityTimes(params: IGetAvailableTimesRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/available-time`, params);
}

export async function resendVerifyEmail(body: ResendVerifyEmailRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/resend-verify-email`, body);
}

export async function importInstructorsCSV(body: ImportInstructorsRequest) {
	return await http.post(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/role-management/import/instructors?dialCode=${body.dialCode}&avatarUrl=${body.avatarUrl}&firstName=${body.firstName}&lastName=${body.lastName}&email=${body.email}&phoneNumber=${body.phoneNumber}&hourRate=${body.hourRate}&teachLanguages=${body.teachLanguages}&languageSpoken=${body.languageSpoken}&timeZone=${body.timeZone}&accountStatus=${body.accountStatus}&address=${body.address}&zipCode=${body.zipCode}&city=${body.city}&state=${body.state}&country=${body.country}&qualification=${body.qualification}&teachingExperience=${body.teachingExperience}&bio=${body.bio}&classTag=${body.classTag}`,
		body.file
	);
}
