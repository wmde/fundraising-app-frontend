import { Store } from 'vuex';
import { NS_PAYMENT } from '@src/store/namespaces';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	isBankTransferPayment: ComputedRef<boolean>,
	isDirectDebitPayment: ComputedRef<boolean>,
	isExternalPayment: ComputedRef<boolean>,
	paymentSummary: ComputedRef<{ amount: number, interval: any, paymentType: any }>,
	paymentWasInitialized: ComputedRef<boolean>
}

export function usePaymentFunctions( store: Store<any> ): ReturnType {
	const isExternalPayment = computed( (): boolean => store.getters[ NS_PAYMENT + '/isExternalPayment' ] );
	const isBankTransferPayment = computed( (): boolean => store.getters[ NS_PAYMENT + '/isBankTransferPayment' ] );
	const isDirectDebit = computed( (): boolean => store.getters[ NS_PAYMENT + '/isDirectDebitPayment' ] );
	const paymentWasInitialized = computed( (): boolean => store.state[ NS_PAYMENT ].initialized );
	const paymentSummary = computed( () => {
		const payment = store.state[ NS_PAYMENT ].values;
		return {
			interval: payment.interval,
			amount: payment.amount / 100,
			paymentType: payment.type,
		};
	} );

	return {
		isBankTransferPayment,
		isDirectDebitPayment: isDirectDebit,
		isExternalPayment,
		paymentSummary,
		paymentWasInitialized,
	};
}
