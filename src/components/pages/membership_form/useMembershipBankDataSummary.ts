import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	bankDataSummary: ComputedRef<{ iban: string; bankName: string; bic: string } | undefined>;
};

export function useMembershipBankDataSummary( store: Store<any> ): ReturnType {
	const bankData = store.state.bankdata.values;

	const bankDataSummary = computed( () => {
		const shouldShowSummary = bankData.iban.trim();
		if ( shouldShowSummary ) {
			return {
				iban: bankData.iban,
				bankName: bankData.bankName,
				bic: bankData.bic,
			};
		}
	} );

	return {
		bankDataSummary,
	};
}
