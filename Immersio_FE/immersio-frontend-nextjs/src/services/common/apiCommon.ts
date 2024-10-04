import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getListCountries() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/countries`, null, addSubdomainIdHeader());
}

export async function getListProficiencyLevels() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/proficiency-levels`, null, addSubdomainIdHeader());
}

export async function getTimezones() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/timezones`, null, addSubdomainIdHeader());
}
