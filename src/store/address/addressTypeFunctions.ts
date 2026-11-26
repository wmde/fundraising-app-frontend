import type { AddressState } from '@src/view_models/Address';
import { AddressType } from '@src/store/address/constants';

export function getAddressType( state: AddressState ): AddressType {
	if ( state.isAnonymous ) {
		return 'anonym';
	}

	if ( !state.receipt ) {
		return 'email';
	}

	return state.isCompany ? 'company_with_contact' : 'person';
}

export function getRequiredFields( state: AddressState ): string[] {
	return state.requiredFields[ getAddressType( state ) ];
}
