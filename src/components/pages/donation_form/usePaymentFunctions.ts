import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	isBankTransferPayment: ComputedRef<boolean>;
	isDirectDebitPayment: ComputedRef<boolean>;
	isExternalPayment: ComputedRef<boolean>;
	paymentSummary: ComputedRef<{ amount: number; interval: any; paymentType: any }>;
	paymentWasInitialized: ComputedRef<boolean>;
};

export function usePaymentFunctions( store: Store<any> ): ReturnType {
	const isExternalPayment = computed( (): boolean => store.getters[ 'payment/isExternalPayment' ] );
	const isBankTransferPayment = computed( (): boolean => store.getters[ 'payment/isBankTransferPayment' ] );
	const isDirectDebit = computed( (): boolean => store.getters[ 'payment/isDirectDebitPayment' ] );
	const paymentWasInitialized = computed( (): boolean => store.state.payment.initialized );
	const paymentSummary = computed( () => {
		const payment = store.state.payment.values;
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
