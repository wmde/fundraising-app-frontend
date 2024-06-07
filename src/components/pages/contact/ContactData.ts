export interface ContactData {
	contact_categories: Record<string, string>;
	firstname?: string;
	lastname?: string;
	donationNumber?: string;
	email?: string;
	category?: string;
	subject?: string;
	messageBody?: string;
	errors?: string[];
}
