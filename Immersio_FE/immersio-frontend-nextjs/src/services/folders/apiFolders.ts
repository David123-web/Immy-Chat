import { addSubdomainIdHeader } from './../../helpers/auth';
import {
	ICreateFolderRequest,
	IDeleteFoldersRequest,
	IGetFolderAmountRequest,
	IGetFoldersRequest,
	IMoveFolderRequest,
	IUpdateItemNameRequest,
} from '@/src/interfaces/mydrive/mydrive.interface';
import { http } from '../axiosService';

export async function createFolder(body: ICreateFolderRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders`, body);
}

export async function getListFolders(params: IGetFoldersRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders`, params);
}

export async function deleteFolders(body: IDeleteFoldersRequest) {
	return await http.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders/delete`, body);
}

export async function downloadFolderById(id: string) {
	return await http.get(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders/download/${id}`,
		null,
		addSubdomainIdHeader()
	);
}

export async function getFolderById(id: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders/${id}`);
}

export async function updateFolderName(body: IUpdateItemNameRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders/name/${body.id}`, { name: body.name });
}

export async function moveFolder(body: IMoveFolderRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders/move/${body.id}`, {
		parentFolderId: body.parentFolderId,
	});
}

export async function getFolderAmount(data: IGetFolderAmountRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/folders/count/`, data);
}
