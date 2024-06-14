export interface UpdateDonorRequest {
	donationId: number;
	updateToken: string;
	addressType: string;
	salutation: string;
	title: string;
	firstName: string;
	lastName: string;
	companyName: string;
	street: string;
	city: string;
	postcode: string;
	country: string;
	email: string;
	mailingList: boolean;
}
