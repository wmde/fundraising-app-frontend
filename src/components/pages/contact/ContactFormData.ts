import type { ContactFormItem } from '@src/components/pages/contact/ContactFormItem';

export interface ContactFormData {
	firstname: ContactFormItem;
	lastname: ContactFormItem;
	donationNumber: ContactFormItem;
	email: ContactFormItem;
	topic: ContactFormItem;
	subject: ContactFormItem;
	comment: ContactFormItem;
}
