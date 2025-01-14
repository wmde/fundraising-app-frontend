import { Store } from 'vuex';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Validity } from '@src/view_models/Validity';

export interface ReceiptModel {
	receiptNeeded: Ref<boolean | null>;
	showReceiptOptionError: ComputedRef<any>;
}

export function useReceiptModel( store: Store<any> ): ReceiptModel {
	const initialReceipt = store.state.address.validity.receipt === Validity.RESTORED ? store.state.address.receipt : null;
	const receiptNeeded = ref<boolean | null>( initialReceipt );

	const showReceiptOptionError = computed( () => {
		return !receiptNeeded.value && store.getters[ 'address/addressTypeIsInvalid' ];
	} );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( 'address', 'setReceiptChoice' ), newValue );
	} );

	return {
		receiptNeeded,
		showReceiptOptionError,
	};
}
