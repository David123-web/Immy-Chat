import { ICustomTableFile } from '@/components/MyDrive/TableFile';
import { IGetCommonDataRequest } from './../common/common.interface';
export enum ProductType {
	COURSE = 'COURSE',
	CLASS = 'CLASS',
	SUBSCRIPTION = 'SUBSCRIPTION',
}

export enum PaymentMethod {
	PAYPAL = 'PAYPAL',
	STRIPE = 'STRIPE',
	IMMERSIO_CREDIT = 'IMMERSIO_CREDIT',
}

export interface IPurchaseWithCredit {
	subdomainId: string;
	purchaserId: string;
	userId: string;
	totalCreditsSpent: number;
	payFromCredit: boolean;
	paymentMethod: PaymentMethod;
	products: IProduct[];
}

export interface IProduct {
	productId: number;
	unitCount: number;
	productType: ProductType;
	creditProcessingComplete: boolean;
	creditProcessingMessage: string;
	creditsSpent: number;
}

export interface IPurchaseWithCreditRequest extends IPurchaseWithCredit {}