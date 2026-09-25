import type { Ref } from 'vue';
import { Validity } from '@src/view_models/Validity';

export interface ContactFormItem {
	name: string;
	value: string;
	pattern: string;
	optionalField: boolean | Ref<boolean>;
	validity: Validity;
}
