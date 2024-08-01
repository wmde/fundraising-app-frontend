import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	addressSummary: ComputedRef<any>,
	inlineSummaryLanguageItem: ComputedRef<string>
};

export function useAddressSummary( store: Store<any> ): ReturnType {
	const addressSummary = computed( () => ( {
		...store.state.address.values,
		fullName: store.getters[ 'address/fullName' ],
		streetAddress: store.state.address.values.street,
		postalCode: store.state.address.values.postcode,
		country: store.state.address.values.country,
	} ) );

	const inlineSummaryLanguageItem = computed( (): string => {
		switch ( store.state.address.addressType ) {
			case AddressTypeModel.ANON:
			case AddressTypeModel.UNSET:
				return 'donation_confirmation_inline_summary_anonymous';
			case AddressTypeModel.EMAIL:
				return 'donation_confirmation_inline_summary_email';
			case AddressTypeModel.COMPANY:
			case AddressTypeModel.PERSON:
			default:
				return 'donation_confirmation_inline_summary_address';
		}
	} );

	return {
		addressSummary,
		inlineSummaryLanguageItem,
	};
}
