import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';
import type { Address } from '@src/view_models/Address';

type ReturnType = {
	addressSummary: ComputedRef<Address | undefined>;
};

export function useAddressSummary( store: Store<any> ): ReturnType {
	const addressSummary = computed( () => {
		const hasSomeAddressDataFilledOut = store.state.address.companyName?.trim() ||
			( store.state.address.firstName?.trim() && store.state.address.lastName?.trim() ) ||
			store.state.address.street?.trim() ||
			( store.state.address.postcode?.trim() && store.state.address.city?.trim() ) ||
			store.state.address.email?.trim();
		if ( !hasSomeAddressDataFilledOut ) {
			return {
				...store.state.address.values,
			};
		}
	} );

	return {
		addressSummary,
	};
}
