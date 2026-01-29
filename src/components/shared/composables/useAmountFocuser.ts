import { Store } from 'vuex';

export const useAmountFocuser = ( store: Store<any> ): () => void => {
	return () => {
		document.getElementById( 'amount-' + store.state.payment.values.amount )?.focus();
	};
};
