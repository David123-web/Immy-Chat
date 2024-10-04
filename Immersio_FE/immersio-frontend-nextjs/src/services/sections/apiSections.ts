import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getSections() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/sections`, null, addSubdomainIdHeader());
}

export async function postSections(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/sections`, data);
}

export async function updateSections(body) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/sections/${body.id}`, { ...body, id: undefined });
}

export async function deleteSections(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/sections/${id}`);
}
