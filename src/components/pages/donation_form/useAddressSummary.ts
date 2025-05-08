import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	addressSummary: ComputedRef<any>;
	hasAddressSummary: ComputedRef<boolean>;
};

export function useAddressSummary( store: Store<any> ): ReturnType {
	const addressSummary = computed( () => ( {
		...store.state.address.values,
		streetAddress: store.state.address.values.street,
		postalCode: store.state.address.values.postcode,
		country: store.state.address.values.country,
	} ) );

		const hasSomeAddressDataFilledOut = addressType !== 'anonym' && (
			store.state.address.companyName?.trim() ||
			( addressValues.firstName?.trim() && addressValues.lastName?.trim() ) ||
			addressValues.street?.trim() ||
			( addressValues.postcode?.trim() && addressValues.city?.trim() ) ||
			addressValues.email?.trim()
		);

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
		hasAddressSummary,
	};
}
