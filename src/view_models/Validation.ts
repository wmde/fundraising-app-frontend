export interface AddressValidation {
	salutation: string;
	title: string;
	companyName: string;
	firstName: string;
	lastName: string;
	street: string;
	city: string;
	postcode: string;
	country: string;
	email: string;
}

export interface ContactFormValidation {
	firstName: string;
	lastName: string;
	donationNumber: string;
	email: string;
	topic: string;
	subject: string;
	comment: string;
}
