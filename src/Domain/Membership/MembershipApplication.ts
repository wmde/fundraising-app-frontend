import { MembershipType } from '@src/view_models/MembershipTypeModel';

export interface MembershipApplication {
	paymentIntervalInMonths: string | number;
	membershipFee: string | number;
	membershipType: MembershipType;
	paymentType: string;
	incentives: string[];
	isExported: boolean;

	id: number;
	accessToken: string;
	updateToken: string;
	receipt: boolean;

	// Following properties are not needed I think
	bankTransferCode: string;
	status: string;
	newsletter: boolean;
	creationDate: string;
}
