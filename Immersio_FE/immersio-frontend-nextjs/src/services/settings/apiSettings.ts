import { EmailTemplateType, ICreateSocialMedialLink, IDeleteSocialMediaLinkRequest, IGetSocialMediaLinkRequest, ISendTestEmailRequest, IUpdateEmailSmtpRequest, IUpdateEmailTemplateRequest, IUpdateSocialMediaLinkRequest, IUpdateSubdomainInformation, IUpdateThemeRequest } from '@/src/interfaces/settings/settings.interfaces';
import { http } from '../axiosService';
import { addSubdomainIdHeader } from './../../helpers/auth';
import { IGetCommonDataRequest } from '@/src/interfaces/common/common.interface';

export async function updateTheme(body: IUpdateThemeRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/theme`, body, addSubdomainIdHeader());
}

export async function updateSubdomainInformation(body: IUpdateSubdomainInformation) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/info`, body, addSubdomainIdHeader());
}

export async function createSocialMediaLink(body: ICreateSocialMedialLink) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/social-links`, body, addSubdomainIdHeader());
}

export async function getListSocialMediaLink(params: IGetSocialMediaLinkRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/social-links`, params, addSubdomainIdHeader());
}

export async function getCreditValue() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/credit-value`);
}


export async function updateSocialMediaLink(body: IUpdateSocialMediaLinkRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/social-links/${body.id}`, body, addSubdomainIdHeader());
}

export async function deleteSocialMediaLink(body: IDeleteSocialMediaLinkRequest) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/social-links/${body.id}`,);
}

export async function getSubdomainSettings() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings`, addSubdomainIdHeader());
}

export async function updateEmailSmtp(body: IUpdateEmailSmtpRequest){
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/email/smtp`, body);
}

export async function sendTestEmail(body: ISendTestEmailRequest){
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/email/send-test`, body);
}

export async function getEmailTemplates(){
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/email/template`);
}

export async function getEmailTemplateByType(type: EmailTemplateType){
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/email/template/${type}`);
}

export async function updateEmailTemplate(data: {type: EmailTemplateType, body: IUpdateEmailTemplateRequest}){
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/email/template/${data.type}`, data.body);
}

export async function getEmailLogs(params?: IGetCommonDataRequest){
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain-settings/email/log`, params);
}