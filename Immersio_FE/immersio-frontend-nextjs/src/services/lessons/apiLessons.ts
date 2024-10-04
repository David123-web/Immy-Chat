import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getLessons() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons`, null, addSubdomainIdHeader());
}

export async function postLesson(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons`, data);
}

export async function getLesson(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons/${id}`, null, addSubdomainIdHeader());
}

export async function updateLesson(body) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons/${body.id}`, { ...body, id: undefined });
}

export async function deleteLesson(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons/${id}`);
}

export async function postLessonsProgress(body: {
	drillId: string;
	index: number;
	currentHealth: number;
	currentDiamond: number;
	isCorrect: boolean;
	isDone: boolean;
}) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons/progresses`, body);
}

export async function resetLessonsProgress(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/lessons/${id}/progresses`);
}