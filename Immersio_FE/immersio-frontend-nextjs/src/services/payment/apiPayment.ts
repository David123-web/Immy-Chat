import { } from '@/src/interfaces/auth/auth.interface';
import { IPurchaseWithCreditRequest } from '@/src/interfaces/payment/payment.interface';
import { http } from '../axiosService';

export async function purchaseWithCredit(body: IPurchaseWithCreditRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payment/purchase-with-credit`, body);
}