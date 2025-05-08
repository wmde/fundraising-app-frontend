import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	bankDataSummary: ComputedRef<{ iban: string; bankName: string; bic: string }>;
};

export function useBankDataSummary( store: Store<any> ): ReturnType {
	const isDirectDebitPayment = computed( (): boolean => store.getters[ 'payment/isDirectDebitPayment' ] );
	const bankDataSummary = computed( () => {
		const bankData = store.state.bankdata.values;

		if ( isDirectDebitPayment.value ) {
			return {
				iban: bankData.iban,
				bankName: bankData.bankName,
				bic: bankData.bic,
			};
		} else {
			return {
				iban: '',
				bankName: '',
				bic: '',
			};
		}
	} );

	return {
		bankDataSummary,
	};
}
