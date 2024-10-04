/* -------------------------------------------------------------------------- */
/*                                  PACKAGES                                  */

import { Option, SubdomainPlanFeature } from '../common/common.interface';

/* -------------------------------------------------------------------------- */
export enum PACKAGES_STATUS {
	Active = 'Active',
	Inactive = 'Legacy',
}

export enum TermSubscriptionPlan {
	MONTHLY = '30',
	TWO_MONTH = '60',
	THREE_MONTH = '90',
	SIX_MONTH = '180',
	ANNUAL = '365',
}

export const TERM_PLAN_OPTIONS: Option<TermSubscriptionPlan>[] = [
	{
		label: '30 Days',
		value: TermSubscriptionPlan.MONTHLY,
	},
	{
		label: '60 Days',
		value: TermSubscriptionPlan.TWO_MONTH,
	},
	{
		label: '90 Days',
		value: TermSubscriptionPlan.THREE_MONTH,
	},
	{
		label: '180 Days',
		value: TermSubscriptionPlan.SIX_MONTH,
	},
	{
		label: '365 Days',
		value: TermSubscriptionPlan.ANNUAL,
	},
];

export interface CreateSubscriptionPlanRequest {
	title: string;
	currency: string;
	cost: number;
	term: TermSubscriptionPlan;
	description: string;
	features: SubdomainPlanFeature[];
}

export interface ISubscriptionPlanResponse {
	id: string;
	paypalId?: string | null; // Marked as nullable
	stripeProductId?: string | null; // Marked as nullable
	title: string;
	description: string;
	cost: number;
	currency: string; // Assuming this is correctly defined elsewhere
	term: number; // Assuming this is correctly defined elsewhere
	features: string[]; // Assuming this is correctly defined elsewhere
	trial: boolean;
	isActive: boolean;
	isPreferred: boolean;
	isDeleted: boolean; // Added as it's present in the response
	deletedAt: string | null; // Added as it's present in the response, marked as nullable
	updatedAt: string; // Added as it's present in the response
	createdAt: string; // Added as it's present in the response
	subdomainId: string;
}

export interface DeactivateSubscriptionPlanRequest {
	isActive: false;
}

/* -------------------------------------------------------------------------- */
/*                                   COUPON                                   */
/* -------------------------------------------------------------------------- */
export enum COUPONS_STATUS {
	ACTIVE = 'Active',
	EXPIRED = 'Expired',
}

export interface ICouponTable {
	name: string;
	code: string;
	discount: number;
	createdAt: Date;
	status: COUPONS_STATUS;
}

export interface ICreditsResponse {
	creditValue: number;
	currency: string;
}
