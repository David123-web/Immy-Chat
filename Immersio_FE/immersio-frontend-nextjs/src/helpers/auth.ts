import { RouterConstants } from '@/constants/router';
import { deleteCookie, getCookie } from 'cookies-next';
import jwt_decode from 'jwt-decode';
import { subdomainStore } from './../stores/subdomain/subdomain.store';

export const jwtValidate = (cookiesAccessToken?: string): boolean => {
	try {
		const token = cookiesAccessToken ? cookiesAccessToken : (getCookie('accessToken') as string);
		const decode = jwt_decode<any>(token);
		const { exp } = decode;
		if (Date.now() >= exp * 1000) {
			return false;
		}
		return true;
	} catch {
		return false;
	}
};

export const logout = () => {
	deleteCookie('accessToken');
	window.location.replace(RouterConstants.LOGIN.path);
};

export const addSubdomainIdHeader = <T = any>(customHeader?: Record<string, T>) => {
	return {
		headers: {
			subdomainId: subdomainStore?.subdomain?.id,
			...customHeader,
		},
	};
};
