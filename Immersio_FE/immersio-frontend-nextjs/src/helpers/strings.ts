// import { AZURE_LINK, FRONT_DOOR_LINK } from '@/utils/constant';

import { AxiosResponse } from 'axios';
import { ROLE_TYPE } from '../interfaces/auth/auth.interface';
import { toast } from 'react-toastify';

// import { LIST_ENDPOINT_BASE_URL_API } from './../utils/endpoint';
export const parseErrorCode = (code: number) => {
	return `ERROR_CODE_${code}`;
};

export const parseRouterName = (name: string) => {
	return name
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, '');
};

export const parseLevelName = (asPath: string) => {
	return asPath.replace(/-/g, ' ').toLocaleUpperCase();
};

export function truncateFileName(name: string, n = 6) {
	const firstName = name.slice(0, n);
	const lastName = name.slice(-n - 4);
	return name.length > n * 2 ? firstName + '...' + lastName : name;
}

export const sliceLanguagesCode = (cultureCode: string) => {
	return cultureCode.slice(0, 2);
};

export const capitalization = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.split(' ')
		.map((e) => e[0].toLocaleUpperCase() + e.substring(1, e.length))
		.join(' ');
};

export const generateColor = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 6) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff;
		color += ('00' + value.toString(16)).substr(-2);
	}
	return color;
};

export const getSubdomainName = () => window.location.hostname.split('.')[0];

export const getRoleName = (role: ROLE_TYPE) => {
	switch (role) {
		case ROLE_TYPE.STUDENT:
			return 'Student';
		case ROLE_TYPE.INSTRUCTOR:
			return 'Instructor';
		case ROLE_TYPE.TUTOR:
			return 'Tutor';
		case ROLE_TYPE.EDITOR:
			return 'Editor';
		case ROLE_TYPE.CUSTOMER_SERVICE:
			return 'Customer Service Representative';
		default:
			return null;
	}
};

export const checkObjectEmpty = (obj: object) => {
	return Object.keys(obj).length > 0;
};

export const getFileNameFromPath = (path: string) => {
	return path.split('/').pop().split('.')[0];
};

export const getExtensionFromPath = (path: string) => {
	return path.split('.').pop().split('?')[0];
};
