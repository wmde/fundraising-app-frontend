import { MembershipType } from '@src/view_models/MembershipTypeModel';

export interface MembershipPaymentSummary {
	paymentIntervalInMonths: string;
	membershipFee: number;
	paymentType: string;
	membershipType: MembershipType;
}
