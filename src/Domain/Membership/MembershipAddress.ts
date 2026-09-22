export interface MembershipAddress {
	fullName: string;
	salutation: string;
	title: string;
	email: string;
	streetAddress: string;
	postalCode: string;
	city: string;
	countryCode: string;
	applicantType: 'person' | 'firma';
	firstName: string;
	lastName: string;
	companyName: string;
}
