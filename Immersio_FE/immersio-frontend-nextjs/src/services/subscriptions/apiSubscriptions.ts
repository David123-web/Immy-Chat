import { CreateSubscriptionPlanRequest, DeactivateSubscriptionPlanRequest } from '@/src/interfaces/subscriptions/subscriptions.interface';
import { http } from '../axiosService';

export async function createSubscriptionPlan(body: CreateSubscriptionPlanRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription-plans`, body);
}

export async function setInactiveSubscriptionPlans({ id, body }: { id: string; body: DeactivateSubscriptionPlanRequest }) {
    return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription-plans/${id}`, body);
}

export async function getSubscriptionPlans() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription-plans`);
}
