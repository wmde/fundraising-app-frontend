import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setReceiptChoice } from '@src/store/address/actionTypes';
import { Validity } from '@src/view_models/Validity';

export function useReceiptModel( store: Store<any> ): Ref<boolean> {
	// Receipt choice defaults true in the store initialisation
	// so set it to null if the validity isn't restored
	if ( store.state.address.validity.receipt !== Validity.RESTORED ) {
		store.dispatch( action( NS_ADDRESS, setReceiptChoice ), null );
	}

	const receiptNeeded = ref<boolean | null>( store.state.address.receipt );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( NS_ADDRESS, setReceiptChoice ), newValue );
	} );

	return receiptNeeded;
}