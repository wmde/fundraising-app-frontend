import { FeeValidity } from '@src/view_models/MembershipFee';
import { MEMBERSHIP_MAXIMUM_CENTS } from '@src/store/membership_fee/constants';

export function validateFee( amount: number, minimumAmount: number ): FeeValidity {

	if ( amount === 0 || amount < minimumAmount ) {
		return FeeValidity.FEE_TOO_LOW;
	}

	if ( amount > MEMBERSHIP_MAXIMUM_CENTS ) {
		return FeeValidity.FEE_TOO_HIGH;
	}

	return FeeValidity.FEE_VALID;
}
