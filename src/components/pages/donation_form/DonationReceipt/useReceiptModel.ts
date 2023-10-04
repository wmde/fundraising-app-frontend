import { Store } from 'vuex';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setReceiptChoice } from '@src/store/address/actionTypes';
import { Validity } from '@src/view_models/Validity';

type ReturnType = {
	receiptNeeded: Ref<boolean>,
	showReceiptOptionError: ComputedRef<any>
};

export function useReceiptModel( store: Store<any>, initialValue: boolean ): ReturnType {
	// Receipt choice defaults true in the store initialization,
	// so set it to the initial value only if it has not been restored during a reload
	if ( store.state[ NS_ADDRESS ].receipt !== initialValue && store.state[ NS_ADDRESS ].validity.receipt !== Validity.RESTORED ) {
		store.dispatch( action( NS_ADDRESS, setReceiptChoice ), initialValue );
	}

	const receiptNeeded = ref<boolean>( initialValue );

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
