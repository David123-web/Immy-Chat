/* ------------------------------ HTTP SERVICE ------------------------------ */
export interface IErrorResponse {
	errorCode: number;
	errorDetail: string;
	errorMessage: string;
	timestamp: number;
}

export type TOrderDirection = 'asc' | 'desc';

export type ICommonOrderBy<TName> = {
	[K in keyof TName]?: TOrderDirection;
};

export interface ICommonGetDataRequest<TOrderName = any, TFilter = any> {
	pageIndex?: number;
	pageSize?: number;
	orderBy?: ICommonOrderBy<TOrderName>;
	filterBy?: TFilter;
}
export interface ICommonDataResponse<TData = any> {
	data: TData;
}

export interface ICommonGetDataResponse<TData = any> {
	data: TData;
	totalItems?: number;
	totalPages?: number;
	pageIndex?: number;
	pageSize?: number;
}

export interface ICommonSearchRequest<T = any> {
	searchBy?: keyof T;
	searchKey?: string;
}

/* --------------------------------- COUNTRY -------------------------------- */
export interface IGetListCountriesResponse {
	code: string;
	dialCode: string;
	name: string;
	subdomainId: null | string;
	createdAt: string;
	updatedAt: string;
	emoji: string;
}

/* ---------------------------- PROFICIENCY LEVEL --------------------------- */
export interface IGetProficiencyLevelsResponse {
	code: string;
	name: string;
	subdomainId: null | string;
	createdAt: string;
	updatedAt: string;
}

/* ------------------------------- PAGINATION ------------------------------- */
export interface IGetCommonDataRequest<T = any> extends ICommonSearchRequest<T> {
	take?: number;
	skip?: number;
	sortBy?: keyof T;
	sortDesc?: boolean | string; // true => desc, '' => asc =))
}

/* -------------------------------- TIMEZONES ------------------------------- */
export type ITimeZone = {
	value: string;
	abbr: string;
	offset: number;
	isdst: boolean;
	text: string;
	utc: string[];
};

/* --------------------------------- OPTION --------------------------------- */
export type Option<T = string> = {
	label: string;
	value: T;
	disabled?: boolean;
};

/* ------------------------------ PLAN FEATURE ------------------------------ */
export enum SubdomainPlanFeature {
	TutorMatch = 'TUTOR_MATCH',
	MyRecordings = 'MY_RECORDINGS',
	ImmyChatBot = 'IMMY_CHAT_BOT',
	AllCourses = 'ALL_COURSES',
}
export const PACKAGE_FEATURES: Option<SubdomainPlanFeature>[] = [
	{
		label: 'All Course',
		value: SubdomainPlanFeature.AllCourses,
	},
	{
		label: 'Tutor Match',
		value: SubdomainPlanFeature.TutorMatch,
	},
	{
		label: 'My recordings',
		value: SubdomainPlanFeature.MyRecordings,
	},
	{
		label: 'Immy Chat bot',
		value: SubdomainPlanFeature.ImmyChatBot,
	},
];
