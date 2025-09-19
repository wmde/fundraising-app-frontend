import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';
import type { InitialBankAccountData } from '@src/view_models/BankAccount';

type ReturnType = {
	bankDataSummary: ComputedRef<InitialBankAccountData | undefined>;
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
