import { AmountValidity } from '@/view_models/Payment';

const minCentAmount = 100;
const maxCentAmount = 9999999;

export function validateAmount( amount: number ): AmountValidity {

	if ( amount < minCentAmount ) {
		return AmountValidity.AMOUNT_TOO_LOW;
	}

	if ( amount > maxCentAmount ) {
		return AmountValidity.AMOUNT_TOO_HIGH;
	}

	return AmountValidity.AMOUNT_VALID;
}

export function isValidAmount( amount: number ): boolean {
	return validateAmount( amount ) === AmountValidity.AMOUNT_VALID;
}
