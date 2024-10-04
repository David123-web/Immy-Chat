import { addSubdomainIdHeader } from './../../helpers/auth';

import {
	IGetFileAmountRequest, IGetFilesRequest,
	IMoveFileRequest, IPublicFileRequest, ISendShareEmailFileRequest, IUpdateItemNameRequest
} from '@/src/interfaces/mydrive/mydrive.interface';
import { http } from '../axiosService';
import { IDeleteFilesRequest } from './../../interfaces/mydrive/mydrive.interface';

export async function uploadFile(body: any) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files`,
    body
  );
}

export async function deleteFiles(body: IDeleteFilesRequest) {
	return await http.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/delete`, body);
}

export async function viewFileByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/${id}/thumbnail`);
}

export async function viewFileLinkByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/link/${id}`);
}

export async function viewFileStreamByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/${id}`);
}

export async function viewFileThumbnailByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/thumbnail/${id}`);
}

export async function viewFileDownloadByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/download/${id}`);
}
export async function getListFiles(params: IGetFilesRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files`, params);
}

export async function getLinkFileById(id: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/link/${id}`);
}

export async function getLinkObjectFileById({ id }: { id: string}) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/link/${id}`);
}

export async function updateFileName(data: IUpdateItemNameRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/name/${data.id}`, { name: data.name });
}

export async function getFileAmount(data?: IGetFileAmountRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/count`, data, addSubdomainIdHeader());
}

export async function moveFile(body: IMoveFileRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/move/${body.id}`, {
		folderId: body.folderId,
	});
}

export async function sendShareEmailFile(body: ISendShareEmailFileRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/send-share-email`, body);
}

export async function publicFile(body: IPublicFileRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/public/${body.id}`, {
		public: body.public,
	});
}

export async function viewPublicThumbnail(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/thumbnail/${id}`);
}

export async function viewPublicVideo(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/link/public/${id}`);
}

export async function viewPublicFile(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/public/${id}`);
}

export async function uploadFileExternal(body: any) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/external`,
    body
  );
}

export async function viewFileExternalByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/drive/files/external/${id}`);
}