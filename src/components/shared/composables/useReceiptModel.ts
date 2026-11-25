import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';

export function useReceiptModel( store: Store<any> ): Ref<boolean> {
	const receiptNeeded = ref<boolean>( store.state.address.receipt );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( 'address', 'setReceiptChoice' ), newValue );
	} );

	return receiptNeeded;
}
