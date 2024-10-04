import { http } from '../axiosService';

export async function getRecords(data) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/voice-record/records`, data);
}

export async function postRecords(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/voice-record/add-record`, data);
}

export async function getRecordDetail(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/voice-record/detail/${id}`);
}

export async function deleteRecords(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/voice-record/${id}`);
}
