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

	const hasAddressSummary = computed( () => {
		const address = addressSummary.value;
		return Boolean(
			address.companyName?.trim() ||
			( address.firstName?.trim() && address.lastName?.trim() ) ||
			address.streetAddress?.trim() ||
			( address.postalCode?.trim() && address.city?.trim() ) ||
			address.email?.trim()
		);
	} );

	return {
		addressSummary,
		hasAddressSummary,
	};
}
