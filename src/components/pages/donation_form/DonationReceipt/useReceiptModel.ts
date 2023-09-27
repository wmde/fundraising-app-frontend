import { Store } from 'vuex';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setReceiptChoice } from '@src/store/address/actionTypes';
import { Validity } from '@src/view_models/Validity';

type ReturnType = {
	receiptNeeded: Ref<boolean|null>,
	showReceiptOptionError: ComputedRef<any>
};

export function useReceiptModel( store: Store<any> ): ReturnType {
	// Receipt choice defaults true in the store initialization
	// so set it to null if the validity isn't restored
	if ( store.state.address.validity.receipt !== Validity.RESTORED ) {
		store.dispatch( action( NS_ADDRESS, setReceiptChoice ), null );
	}

	const receiptNeeded = ref<boolean | null>( store.state.address.receipt );

	const showReceiptOptionError = computed( () => {
		return !receiptNeeded.value && store.getters[ 'address/addressTypeIsInvalid' ];
	} );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( NS_ADDRESS, setReceiptChoice ), newValue );
	} );

	return {
		receiptNeeded,
		showReceiptOptionError,
	};
}
