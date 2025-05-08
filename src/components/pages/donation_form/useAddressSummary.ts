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
		return Boolean( address.companyName?.trim() ) ||
			Boolean( address.salutation?.trim() ) ||
			Boolean( address.title?.trim() ) ||
			Boolean( address.firstName?.trim() ) ||
			Boolean( address.lastName?.trim() ) ||
			Boolean( address.street?.trim() ) ||
			Boolean( address.postcode?.trim() ) ||
			Boolean( address.city?.trim() ) ||
			Boolean( address.email?.trim() );
	} );

	return {
		addressSummary,
		hasAddressSummary,
	};
}
