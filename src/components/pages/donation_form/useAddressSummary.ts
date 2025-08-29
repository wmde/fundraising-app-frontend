import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';
import type { Address } from '@src/view_models/Address';
import { addressTypeName } from '@src/view_models/AddressTypeModel';

type ReturnType = {
	addressSummary: ComputedRef<Address | undefined>;
};

export function useAddressSummary( store: Store<any> ): ReturnType {
	const addressSummary = computed( () => {
		const addressValues = store.state.address.values;
		const addressType = addressTypeName( store.state.address.addressType );

		if ( addressType === 'anonym' ) {
			return undefined;
		}

		const hasSomeAddressDataFilledOut = store.state.address.companyName?.trim() ||
			( addressValues.firstName?.trim() && addressValues.lastName?.trim() ) ||
			addressValues.street?.trim() ||
			( addressValues.postcode?.trim() && addressValues.city?.trim() ) ||
			addressValues.email?.trim();

		if ( hasSomeAddressDataFilledOut ) {
			return {
				addressType,
				...addressValues,
			};
		}

		return undefined;
	} );

	return {
		addressSummary,
	};
}
