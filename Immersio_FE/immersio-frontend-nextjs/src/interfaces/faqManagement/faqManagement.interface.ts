import { IGetCommonDataRequest } from '../common/common.interface';

/* ----------------------------- BLOG CATEGORIES ---------------------------- */
export enum FAQ_CATEGORY_STATUS {
	ACTIVE = 'Active',
	NOT_ACTIVE = 'Not Active',
}

export interface IFAQCategoriesTable {
	name: string;
	status: FAQ_CATEGORY_STATUS;
}

export interface IAddFAQCategoryForm {
	name: string;
	active: boolean;
}

export interface IAddFAQCategoryRequest extends IAddFAQCategoryForm {}

export interface IUpdateFAQCategoryRequest extends IAddFAQCategoryForm {}

export interface IFAQCategoryDetail {
	id: string;
	subdomainId: string;
	name: string;
	active: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IGetFAQCategoriesResponse {
	total: number;
	data: IFAQCategoryDetail[];
}

export type TGetFAQCategoriesSearchBy = Pick<IFAQCategoryDetail, 'name'>;

export interface IGetFAQCategoriesRequest extends IGetCommonDataRequest<TGetFAQCategoriesSearchBy> {}

/* ---------------------------------- BLOG ---------------------------------- */
export interface IFAQsTable {
	title: string;
	category: string;
	publishedAt: Date;
}
export interface IAddFAQForm {
	categoryId: string;
	question: string;
	answer: string;
}

export interface IAddFAQRequest extends IAddFAQForm {}

export interface IUpdateFAQRequest extends IAddFAQForm {}

export interface IFAQDetail {
	id: string;
	subdomainId: string;
	categoryId: string;
	question: string;
	answer: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
  category: {
		name: string;
	};
}

export interface IGetFAQResponse {
	total: number;
	data: IFAQDetail[];
}

export type TGetFAQSearchBy = Pick<IFAQDetail, 'question'>;

export interface IGetFAQRequest extends IGetCommonDataRequest<TGetFAQSearchBy> {}

export interface IGetFAQByIdResponse {
	id: string;
	subdomainId: string;
	categoryId: string;
	question: string;
	answer: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
	category: IFAQCategoryDetail;
}
