import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	bankDataSummary: ComputedRef<{ iban: string; bankName: string; bic: string }>;
};

export function useBankDataSummary( store: Store<any> ): ReturnType {
	const bankDataSummary = computed( () => {
		const bankData = store.state.bankdata.values;
		return {
			iban: bankData.iban,
			bankName: bankData.bankName,
			bic: bankData.bic,
		};
	} );

	return {
		bankDataSummary,
	};
}
