import {
    ICreateOfflinePaymentGateways,
	IDeleteOfflinePaymentGatewayByIdRequest,
	IGetOfflinePaymentGatewayByIdRequest,
	IGetOfflinePaymentGatewaysRequest,
	IUpdateOfflinePaymentGatewayByIdRequest,
	IUpdateOnlinePaymentGateways,
} from '@/src/interfaces/paymentGateways/paymentGateways.interface';
import { http } from '../axiosService';

export async function getOnlinePaymentGateways() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/online-payment-gateways`);
}

export async function updateOnlinePaymentGateways(body: IUpdateOnlinePaymentGateways) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/online-payment-gateways`, body);
}

export async function getOfflinePaymentGateways(params: IGetOfflinePaymentGatewaysRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/offline-payment-gateways`, params);
}

export async function createOfflinePaymentGateways(body: ICreateOfflinePaymentGateways) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/offline-payment-gateways`, body);
}

export async function getOfflinePaymentGatewayById(params: IGetOfflinePaymentGatewayByIdRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/offline-payment-gateways/${params}`);
}

export async function updateOfflinePaymentGatewayById(data: {id: string,body: IUpdateOfflinePaymentGatewayByIdRequest}) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/offline-payment-gateways/${data.id}`, data.body);
}

export async function deleteOfflinePaymentGatewayById(params: IDeleteOfflinePaymentGatewayByIdRequest) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/offline-payment-gateways/${params}`);
}