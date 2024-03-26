export interface MembershipApplication {
	paymentIntervalInMonths: string|number;
	membershipFee: string|number;
	membershipType: 'active'|'sustaining';
	paymentType: string;
	incentives: string[];
}
