import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';

type ReturnType = {
	bankDataSummary: ComputedRef<{ iban: string; bankName: string; bic: string } | undefined>;
};

export function useBankDataSummary( store: Store<any> ): ReturnType {
	const { isDirectDebitPayment } = usePaymentFunctions( store );
	const bankData = store.state.bankdata.values;

	const bankDataSummary = computed( () => {
		const shouldShowSummary = bankData.iban.trim() && isDirectDebitPayment.value;
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
