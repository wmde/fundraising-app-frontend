import { Store } from 'vuex';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { Validity } from '@src/view_models/Validity';

type ReturnType = {
	receiptNeeded: Ref<boolean|null>,
	showReceiptOptionError: ComputedRef<any>
};

export function useReceiptModel( store: Store<any> ): ReturnType {
	const initialReceipt = store.state[ NS_ADDRESS ].validity.receipt === Validity.RESTORED ? store.state[ NS_ADDRESS ].receipt : null;
	const receiptNeeded = ref<boolean|null>( initialReceipt );

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
