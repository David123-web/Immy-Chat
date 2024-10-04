import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { logout } from '../helpers/auth';
import { IErrorResponse } from '../interfaces/common/common.interface';

export enum StatusCode {
	Unauthorized = 401,
	Forbidden = 403,
	TooManyRequests = 429,
	InternalServerError = 500,
}

const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
	try {
		const token = getCookie('accessToken');

		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`,
			};
		}
		return config;
	} catch (error: any) {
		throw new Error(error);
	}
};

class Http {
	private instance: AxiosInstance | null = null;
	private get http(): AxiosInstance {
		return this.instance != null ? this.instance : this.initHttp();
	}

	static queryParamsURLEncodedString(params: Record<string, any>): string {
		const str: string[] = [];
		for (const p in params) {
			if (typeof params[p] === 'object' && !Array.isArray(params[p])) {
				for (const v in params[p]) {
					str.push(encodeURIComponent(`${p}.${v}`) + '=' + encodeURIComponent(params[p][v]));
				}
			} else if (typeof params[p] === 'object' && Array.isArray(params[p])) {
				for (const v in params[p]) {
					str.push(encodeURIComponent(`${p}[]`) + '=' + encodeURIComponent(params[p][v]));
				}
			} else {
				str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
			}
		}
		return str.join('&');
	}

	initHttp() {
		const http = axios.create();
		http.interceptors.request.use(
			async (value) => {
				return {
					...injectToken(value),
					headers: {
						...injectToken(value).headers,
					},
				};
			},
			(error) => Promise.reject(error)
		);

		http.interceptors.response.use(
			(response) => response,
			(error) => {
				const { response } = error;
				return this.handleError(response);
			}
		);

		this.instance = http;
		return http;
	}

	request<T = unknown, R = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<R>> {
		return this.http.request<T, AxiosResponse<R>>(config);
	}

	get<T = unknown, R = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
		const query = data ? Http.queryParamsURLEncodedString(data) : '';
		return this.http.get<T, AxiosResponse<R>>(url + '?' + query, config);
	}

	post<T = unknown, R = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
		return this.http.post<T, AxiosResponse<R>>(url, data, config);
	}

	put<T = unknown, R = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
		return this.http.put<T, AxiosResponse<R>>(url, data, config);
	}

	delete<T = unknown, R = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
		return this.http.delete<T, AxiosResponse<R>>(url, config);
	}

	patch<T = unknown, R = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
		return this.http.patch<T, AxiosResponse<R>>(url, data, config);
	}

	private handleError(error: AxiosResponse<IErrorResponse>) {
		const { status = 0 } = error;

		switch (status) {
			case StatusCode.InternalServerError: {
				// Handle InternalServerError
				break;
			}
			case StatusCode.Forbidden: {
				// Handle Forbidden
				break;
			}
			case StatusCode.Unauthorized: {
				logout();
				break;
			}
			case StatusCode.TooManyRequests: {
				// Handle TooManyRequests
				break;
			}
		}

		return Promise.reject(error);
	}
}

export const http = new Http();
