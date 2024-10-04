import { IListTutorRequest, IPostProfileTeacher, IUpdateUserProfileForm } from '@/src/interfaces/user/user.interface';
import { http } from '../axiosService';
import { addSubdomainIdHeader } from './../../helpers/auth';

export async function getCurrentUser() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/me`);
}

export async function uploadAvatar(file: any) {
	return await http.post(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/avatar/upload`,
		file,
		addSubdomainIdHeader({
			'Content-Type': 'multipart/form-data',
		})
	);
}

export async function getAllInstructors() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/instructors/public`, null, addSubdomainIdHeader());
}

export async function getAllTutors() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/tutors/public`, null, addSubdomainIdHeader());
}

export async function postProfileTeacher(body: IPostProfileTeacher) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/profile/instructor`, body);
}

export async function updateUserProfile(body: IUpdateUserProfileForm) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/profile`, body);
}

export async function getTutors(params: IListTutorRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/tutors/public`, params);
}

export async function getUserById(id: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/${id}`);
}