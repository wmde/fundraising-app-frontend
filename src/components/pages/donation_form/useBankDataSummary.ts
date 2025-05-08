import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';

type ReturnType = {
	hasBankDataSummary: ComputedRef<boolean>;
	bankDataSummary: ComputedRef<{ iban: string; bankName: string; bic: string }>;
};

export function useBankDataSummary( store: Store<any> ): ReturnType {
	const { isDirectDebitPayment } = usePaymentFunctions( store );
	const bankData = store.state.bankdata.values;

	const hasBankDataSummary: ComputedRef<boolean> = computed( () =>
		Boolean(
			isDirectDebitPayment.value &&
			bankData.iban
		)
	);

	const bankDataSummary = computed( () => {
		if ( hasBankDataSummary.value ) {
			return {
				iban: bankData.iban,
				bankName: bankData.bankName,
				bic: bankData.bic,
			};
		}
	} );

	return {
		bankDataSummary,
		hasBankDataSummary,
	};
}
