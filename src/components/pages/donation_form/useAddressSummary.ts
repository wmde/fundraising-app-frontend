import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { NS_ADDRESS } from '@src/store/namespaces';
import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	addressSummary: ComputedRef<any>,
	inlineSummaryLanguageItem: ComputedRef<string>
};

export function useAddressSummary( store: Store<any> ): ReturnType {
	const addressSummary = computed( () => ( {
		...store.state[ NS_ADDRESS ].values,
		fullName: store.getters[ NS_ADDRESS + '/fullName' ],
		streetAddress: store.state[ NS_ADDRESS ].values.street,
		postalCode: store.state[ NS_ADDRESS ].values.postcode,
		country: store.state[ NS_ADDRESS ].values.country,
	} ) );

	const inlineSummaryLanguageItem = computed( (): string => {
		switch ( store.state[ NS_ADDRESS ].addressType ) {
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
