import { IGetCommonDataRequest } from '../common/common.interface';
import { IFile } from '../mydrive/mydrive.interface';

/* ----------------------------- BLOG CATEGORIES ---------------------------- */
export enum BLOG_CATEGORY_STATUS {
	ACTIVE = 'Active',
	NOT_ACTIVE = 'Not Active',
}

export interface IBlogCategoriesTable {
	name: string;
	status: BLOG_CATEGORY_STATUS;
}

export interface IAddBlogCategoryForm {
	name: string;
	active: boolean;
}

export interface IAddBlogCategoryRequest extends IAddBlogCategoryForm {}

export interface IUpdateBlogCategoryRequest extends IAddBlogCategoryForm {}

export interface IBlogCategoryDetail {
	id: string;
	subdomainId: string;
	name: string;
	active: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IGetBlogCategoriesResponse {
	total: number;
	data: IBlogCategoryDetail[];
}

export type TGetBlogCategoriesSearchBy = Pick<IBlogCategoryDetail, 'name'>;

export interface IGetBlogCategoriesRequest extends IGetCommonDataRequest<TGetBlogCategoriesSearchBy> {}

/* ---------------------------------- BLOG ---------------------------------- */
export interface IBlogTable {
	title: string;
	category: string;
	author: string;
	publishedAt: Date;
}

export interface IAddBlogForm {
	title: string;
	categoryId: string;
	author: string;
	content: string;
	metaDescription: string;
	metaKeywords: string[];
	fileIds: string[];
}

export interface IAddBlogRequest extends IAddBlogForm {}

export interface IUpdateBlogRequest extends IAddBlogForm {}

export interface IBlogDetail {
	id: string;
	subdomainId: string;
	categoryId: string;
	title: string;
	author: string;
	content: string;
	metaKeywords: string[];
	metaDescription: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
	category: {
		name: string;
	};
}

export interface IGetBlogResponse {
	total: number;
	data: IBlogDetail[];
}

export type TGetBlogSearchBy = Pick<IBlogDetail, 'title' | 'author' | 'content' | 'metaDescription' | 'metaKeywords'>;

export interface IGetBlogRequest extends IGetCommonDataRequest<TGetBlogSearchBy> {}

export interface IGetBlogByIdResponse {
	id: string;
	subdomainId: string;
	categoryId: string;
	title: string;
	author: string;
	content: string;
	metaKeywords: string[];
	metaDescription: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
	category: IBlogCategoryDetail;
	files: IFile[];
}
