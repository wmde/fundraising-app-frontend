import { Validity } from '@src/view_models/Validity';

export interface ContactFormItem {
	name: string;
	value: string;
	pattern: string;
	optionalField: boolean;
	validity: Validity;
}
