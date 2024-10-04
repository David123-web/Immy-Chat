import { addSubdomainIdHeader } from './../../helpers/auth';
import {
	ICheckExistEmailRequest,
	IEmailVerifyRequest,
	IForgotPasswordRequest,
	ILoginRequest,
	ILoginThirdPartyRequest,
	IRegisterRequest,
	IRegisterTeacherRequest,
	IResetPasswordRequest,
	ISendMagicLinkRequest,
	IVerifyMagicLinkRequest,
	IVerifyRequest,
} from '@/src/interfaces/auth/auth.interface';
import { http } from '../axiosService';

export async function register(body: IRegisterRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`, body, addSubdomainIdHeader());
}

export async function login(body: ILoginRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, body, addSubdomainIdHeader());
}

export async function loginThirdParty(body: ILoginThirdPartyRequest) {
	return await http.post(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login/third-party`,
		body,
		addSubdomainIdHeader()
	);
}

export async function verify(body: IVerifyRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify`, body, addSubdomainIdHeader());
}

export async function verifyEmail(body: IEmailVerifyRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/email/verify`, body, addSubdomainIdHeader());
}

export async function confirm(token: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/confirm/${token}`, null, addSubdomainIdHeader());
}

export async function forgotPassword(body: IForgotPasswordRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/password/forgot`, body, addSubdomainIdHeader());
}

export async function sendMagicLink(body: ISendMagicLinkRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/magic-link/send`, body, addSubdomainIdHeader());
}

export async function verifyMagicLink(body: IVerifyMagicLinkRequest) {
	return await http.post(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/magic-link/verify`,
		body,
		addSubdomainIdHeader()
	);
}

export async function resetPassword(body: IResetPasswordRequest) {
	return await http.patch(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/password/forgot/${body.token}`,
		{
			newPassword: body.newPassword,
		},
		addSubdomainIdHeader()
	);
}

export async function registerTeacher(body: IRegisterTeacherRequest) {
	return await http.post(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register/instructor`,
		body,
		addSubdomainIdHeader()
	);
}

export async function checkExistEmail(body: ICheckExistEmailRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/email/exist`, body, addSubdomainIdHeader());
}
