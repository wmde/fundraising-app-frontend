import { Validity } from '@src/view_models/Validity';

export interface ValidationSummaryItem {
	validity: Validity;
	message: String;
	focusElement: string;
	scrollElement: string;
}
