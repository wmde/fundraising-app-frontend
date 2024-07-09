import { Store } from 'vuex';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';

type ReturnType = {
	receiptNeeded: Ref<boolean>,
	showReceiptOptionError: ComputedRef<any>
};

export function useReceiptModel( store: Store<any> ): ReturnType {
	const receiptNeeded = ref<boolean>( store.state[ NS_ADDRESS ].receipt );

	const showReceiptOptionError = computed( () => {
		return !receiptNeeded.value && store.getters[ 'address/addressTypeIsInvalid' ];
	} );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( NS_ADDRESS, 'setReceiptChoice' ), newValue );
	} );

	return {
		receiptNeeded,
		showReceiptOptionError,
	};
}
