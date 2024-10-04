import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getPhrases(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/phrases`, body, addSubdomainIdHeader());
}

export async function getPhrasesPublic(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/phrases/public`, body, addSubdomainIdHeader());
}

export async function postPhrase(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/phrases`, data, addSubdomainIdHeader());
}

export async function getPhrase(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/phrases/${id}`, null, addSubdomainIdHeader());
}

export async function updatePhrase(body) {
	return await http.patch(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/phrases/${body.id}`,
		{ ...body, id: undefined },
		addSubdomainIdHeader()
	);
}

export async function deletePhrase(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/phrases/${id}`, addSubdomainIdHeader());
}
