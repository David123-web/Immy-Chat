export enum GatewayType {
	PAYPAL = 'PAYPAL',
	STRIPE = 'STRIPE',
	OTHER = 'OTHER',
}

export interface IOnlineGateway {
	id: string;
	type: GatewayType;
	subdomainId: string;
	clientId: string;
	secretKey: string;
	isActivated: boolean;
	updatedAt: string
}

export interface IUpdateOnlinePaymentGateways {
	type: GatewayType;
	subdomainId: string;
	clientId: string;
	secretKey: string;
	isActivated: boolean;
}

export interface IGetOfflinePaymentGatewaysRequest {
	take?: number;
	skip?: number;
	sortBy?: string; //keyof TData
	sortDesc?: boolean;
}

export interface ICreateOfflinePaymentGateways {
	name: string;
	description: string;
	instruction: string;
	serialNumber: string;
	isActivated: boolean;
}

export interface IGetOfflinePaymentGatewayByIdRequest {
	id: string;
}

export interface IUpdateOfflinePaymentGatewayByIdRequest {
	name: string;
	description: string;
	instruction: string;
	serialNumber: string;
	isActivated: boolean;
}

export interface IDeleteOfflinePaymentGatewayByIdRequest {
	id: string;
}