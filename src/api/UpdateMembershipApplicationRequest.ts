export interface UpdateMembershipApplicationRequest {
	membershipId: number;
	updateToken: string;

	addressType: string;

	salutation: string;
	title: string;
	firstName: string;
	lastName: string;
	companyName: string;

	street: string;
	postcode: string;
	city: string;
	country: string;

	email: string;
}
