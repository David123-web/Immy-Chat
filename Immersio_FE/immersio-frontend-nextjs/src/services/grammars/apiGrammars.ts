import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getGrammars(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/grammars`, body, addSubdomainIdHeader());
}

export async function getGrammarsPublic(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/grammars/public`, body, addSubdomainIdHeader());
}

export async function postGrammar(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/grammars`, data, addSubdomainIdHeader());
}

export async function getGrammar(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/grammars/${id}`, null, addSubdomainIdHeader());
}

export async function updateGrammar(body) {
	return await http.patch(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/grammars/${body.id}`,
		{ ...body, id: undefined },
		addSubdomainIdHeader()
	);
}

export async function deleteGrammar(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/grammars/${id}`, addSubdomainIdHeader());
}
