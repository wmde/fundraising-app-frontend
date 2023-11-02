import { FeeValidity } from '@src/view_models/MembershipFee';

const maxCentAmount = 100_000_00;

export function validateFee( amount: number, minimumAmount: number ): FeeValidity {

	if ( amount < minimumAmount ) {
		return FeeValidity.FEE_TOO_LOW;
	}

	if ( amount > maxCentAmount ) {
		return FeeValidity.FEE_TOO_HIGH;
	}

	return FeeValidity.FEE_VALID;
}
