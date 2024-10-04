import { ICustomTableFile } from '@/components/MyDrive/TableFile';
import { IGetCommonDataRequest } from './../common/common.interface';
export enum FileType {
	VIDEO = 'VIDEO',
	IMAGE = 'IMAGE',
	AUDIO = 'AUDIO',
	PDF = 'PDF',
	OTHER = 'OTHER',
	DOCUMENTATION = 'DOCUMENTATION',
	PRESENTATION = 'PRESENTATION',
	SHEET = 'SHEET',
}

export enum FolderType {
	FOLDER = 'FOLDER',
}

export interface IFile {
	id: string;
	ownerId: string;
	folderId: string | null;
	s3Key: string;
	s3Location: string;
	type: FileType;
	ext: string;
	name: string;
	size: number;
	public: boolean;
	createdAt: string;
	updatedAt: string;
	folder: string | null;
	thumbnail: string | null;
}

export interface IFolder {
	id: string;
	userId: string;
	parentFolderId: null | string;
	name: string;
	public: boolean;
	createdAt: string;
	updatedAt: string;
	parentFolder: null | IFolder;
	fixed: boolean;
}

export interface IHeaderTable<TData = any> {
	label: string;
	key: keyof TData;
	style?: React.CSSProperties;
	widthGrid?: string;
	enableSort?: boolean;
	classNameRow?: string;
}

export type TTypeRecord = 'file' | 'folder';

export interface IUploadFileRequest {
	file: any;
	name?: string;
	folderId?: string;
	public: boolean;
}

export interface IUploadFileResponse {
	id: string;
	name: string;
	ext: string;
	externalLink: null;
	type: string;
	public: boolean;
	size: number;
	folder: null;
	s3Location: string;
	thumbnail: {
		s3Key: string;
	};
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		profile: {
			firstName: string;
			lastName: string;
		};
	};
}
export interface IGetFilesRequest extends IGetCommonDataRequest<ICustomTableFile> {
	folderId?: string | 'root';
	search?: string;
}
export interface IDeleteFileRequest {
	ids: string[];
}
export interface IMoveFileRequest {
	id: string;
	folderId: string;
}

export interface ICreateFolderRequest {
	name: string;
	parentFolderId?: string;
	public: boolean;
}

export interface IGetFoldersRequest {
	parentFolderId?: string | 'root';
	search?: string;
	fixed?: boolean;
}

export interface IDeleteFoldersRequest {
	ids: string[];
}

export interface IDeleteFilesRequest {
	ids: string[];
}
export interface IUpdateItemNameRequest {
	id: string;
	name: string;
}
export interface ISendShareEmailFileRequest {
	fileId: string;
	email: string;
}
export interface IPublicFileRequest {
	id: string;
	public: boolean;
}

export interface IUpdateFolderNameRequest {
	id: string;
	name: string;
}

export interface IMoveFolderRequest {
	id: string;
	parentFolderId: string;
}

export interface IGetDetailFolderResponse {
	id: string;
	parentFolderId: null;
	name: string;
	userId: string;
	public: boolean;
	updatedAt: string;
	createdAt: string;
	fixed: boolean;
	files: IFile[];
	folders: IFolder[];
}

export interface IGetFileAmountRequest {
	folderId?: string;
	search?: string;
}

export interface IGetFolderAmountRequest {
	parentFolderId?: string;
	search?: string;
}

export interface IGetFileByIdResponse extends IUploadFileResponse {}
