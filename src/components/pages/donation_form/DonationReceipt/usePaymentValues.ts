import { Store } from 'vuex';
import { computed, ComputedRef } from 'vue';

type ReturnType = {
	amount: ComputedRef<string>,
	interval: ComputedRef<string>,
	paymentType: ComputedRef<string>
};

export function usePaymentValues( store: Store<any> ): ReturnType {
	const amount = computed<string>( () => store.state.payment.values.amount );
	const interval = computed<string>( () => store.state.payment.values.interval );
	const paymentType = computed<string>( () => store.state.payment.values.type );

	return {
		amount,
		interval,
		paymentType,
	};
}
