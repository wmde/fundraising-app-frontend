import { MembershipType } from '@src/view_models/MembershipTypeModel';

export interface MembershipApplication {
	paymentIntervalInMonths: string | number;
	membershipFee: string | number;
	membershipType: MembershipType;
	paymentType: string;
	incentives: string[];
	isExported: boolean;
}
