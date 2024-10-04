import { IGetCommonDataRequest, Option } from '../common/common.interface';
import { IHeaderTable } from '../mydrive/mydrive.interface';

export enum ThemeType {
	Blue = 'Blue',
	Teal = 'Teal',
	Immersio = 'Immersio',
	YellowGreen = 'Yellow Green',
}

export const THEME_ITEMS = [
  {
		colors: {
			textColor: '#2D2D2D',
			linkColor: '#0086AF',
			primaryColor: '#3AB2E6',
			secondaryColor: '#A6ECFF',
			accentColor: '#DDC973',
			backgroundColor: '#F1F3F5',
		},
		title: ThemeType.Immersio,
	},
	{
		colors: {
			textColor: '#000000',
			linkColor: '#173E43',
			primaryColor: '#03676F',
			secondaryColor: '#3FB0AC',
			accentColor: '#FEB005',
			backgroundColor: '#F1F3F5',
		},
		title: ThemeType.Teal,
	},
	{
		colors: {
			textColor: '#000000',
			linkColor: '#002857',
			primaryColor: '#00509D',
			secondaryColor: '#088AEC',
			accentColor: '#FEB055',
			backgroundColor: '#F1F3F5',
		},
		title: ThemeType.Blue,
	},
	{
		colors: {
			textColor: '#000000',
			linkColor: '#607031',
			primaryColor: '#778E3A',
			secondaryColor: '#E0E9BD',
			accentColor: '#FEB055',
			backgroundColor: '#F1F3F5',
		},
		title: ThemeType.YellowGreen,
	},
];

export const columnSettings: IHeaderTable<IGetSocialMediaLinkResponse & { tools: string }>[] = [
	{
		label: 'Icon',
		key: 'icon',
		widthGrid: '1fr',
	},
	{
		label: 'URL',
		key: 'url',
		widthGrid: '1fr',
	},
	{
		label: 'Order Number',
		key: 'order',
		widthGrid: '1fr',
	},
	{
		label: 'Actions',
		key: 'tools',
	},
];

export const searchSettingOptions: Option<keyof IGetSocialMediaLinkResponse>[] = [
	{
		value: 'url',
		label: 'URL',
	},
];

export interface IMailLogsTable {
	to: string;
	timeStamp: string;
	subject: string;
	error: string; // TODO: enum
}
export interface IGetMailLogsResponse {
total: number;
data: IMailLog[];
}
export interface IMailLog {
	id: number;
	messageId: null;
	type: null;
	from: null;
	to: string;
	createdAt: Date;
	subject: string;
	body: string;
	error: string;
	subdomainId: string;
}

export const columnMailLogs: IHeaderTable<IMailLogsTable>[] = [
	{
		label: 'To',
		key: 'to',
		widthGrid: '1fr',
	},
	{
		label: 'Timestamp',
		key: 'timeStamp',
		widthGrid: '1fr',
	},
	{
		label: 'Subject',
		key: 'subject',
		widthGrid: '1fr',
	},
	{
		label: 'Error',
		key: 'error',
	},
];

export interface IGetEmailTemplateResponse {
	type: EmailTemplateType;
	id: number;
	subject: string;
	content: string;
}

export interface IGetEmailTemplateTable {
	emailType: string;
	emailSubject: string;
}

export const columnEmailTemplates: IHeaderTable<IGetEmailTemplateTable & { tools: string }>[] = [
	{
		label: 'Email Type',
		key: 'emailType',
		widthGrid: '1fr',
	},
	{
		label: 'Email Subject',
		key: 'emailSubject',
		widthGrid: '1fr',
	},
	{
		label: 'Actions',
		key: 'tools',
		widthGrid: '1fr',
	},
];

export interface IUpdateThemeRequest {
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	textColor: string;
	backgroundColor: string;
	linkColor: string;
	logoUrl: string;
	faviconUrl: string;
}

export interface IUpdateSubdomainInformation {
	title: string;
	email: string;
	contactNumber: string;
	address: string;
}

export enum SocialMediaIcon {
	Facebook = 'Facebook',
	Instagram = 'Instagram',
	Linkedin = 'Linkedin',
	Twitter = 'Twitter',
	Youtube = 'Youtube',
}

export interface ICreateSocialMedialLink {
	icon: SocialMediaIcon;
	url: string;
	order: number;
}

export interface IGetSocialMediaLinkRequest extends IGetCommonDataRequest {}

export interface IGetSocialMediaLinkResponse {
	icon: SocialMediaIcon;
	url: string;
	order: number;
	id: string;
}

export interface IUpdateSocialMediaLinkRequest extends IGetSocialMediaLinkResponse {}

export interface IDeleteSocialMediaLinkRequest {
	id: string;
}

export enum EmailSmtpSecure {
	None = 'None',
	SSL = 'SSL',
	TSL = 'TSL',
}

export interface IUpdateEmailSmtpRequest {
	fromEmail: string;
	fromName: string;
	host: string;
	secure: EmailSmtpSecure;
	port: number;
	authenticate: boolean;
	username: string;
	password: string;
}

export interface IGetSubdomainSettingsResponse {
	id: number;
	paypalActive: boolean;
	paypalTestMode: boolean;
	paypalClientId: string;
	paypalClientSecret: string;
	stripeActive: boolean;
	stripeKey: string;
	stripeSecret: string;
	googleClientId: null;
	googleClientSecret: null;
	googleRefreshToken: null;
	address: string;
	email: null;
	contactNumber: null;
	socialLinks: {
		facebook: string;
		instagram: string;
		youtube: string;
	};
	supportLinks: {
		getHelp: string;
		contactUs: string;
		faqs: string;
	};
	emailFrom: null;
	emailName: null;
	emailSMTPHost: null;
	emailSMTPSecure: null;
	emailSMTPPort: null;
	emailSMTPAuth: null;
	emailSMTPUsername: null;
	emailSMTPPassword: null;
	daysBeforeExpirationReminder: number;
	createdAt: Date;
	updatedAt: Date;
	subdomainId: string;
}

export interface ISendTestEmailRequest {
	to: string;
	subject: string;
	message: string;
}

export enum EmailTemplateType {
	VERIFY_EMAIL = 'VERIFY_EMAIL',
	RESET_PASSWORD = 'RESET_PASSWORD',
	SUBSCRIPTION_CONFIRMATION = 'SUBSCRIPTION_CONFIRMATION',
	WELCOME = 'WELCOME',
	ACCOUNT_DEACTIVATION = 'ACCOUNT_DEACTIVATION',
	CANCELLATION = 'CANCELLATION',
	REVIEW_REQUEST = 'REVIEW_REQUEST',
	PAYMENT_REQUEST = 'PAYMENT_REQUEST',
	PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
	SUBCRIPTION_RENEWAL_REMINDER = 'SUBCRIPTION_RENEWAL_REMINDER',
	REPORT_REQUEST = 'REPORT_REQUEST',
}

export interface IUpdateEmailTemplateRequest {
	subject: string;
	content: string;
}
