import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getVocabularies(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/vocabularies`, body, addSubdomainIdHeader());
}

export async function getVocabulariesPublic(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/vocabularies/public`, body, addSubdomainIdHeader());
}

export async function postVocabulary(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/vocabularies`, data, addSubdomainIdHeader());
}

export async function getVocabulary(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/vocabularies/${id}`, null, addSubdomainIdHeader());
}

export async function updateVocabulary(body) {
	return await http.patch(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/vocabularies/${body.id}`,
		{ ...body, id: undefined },
		addSubdomainIdHeader()
	);
}

export async function deleteVocabulary(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/vocabularies/${id}`, addSubdomainIdHeader());
}
