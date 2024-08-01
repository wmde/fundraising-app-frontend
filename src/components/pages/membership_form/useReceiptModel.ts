import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';

type ReturnType = {
	receiptNeeded: Ref<boolean>,
};

export function useReceiptModel( store: Store<any>, initialValue: boolean ): ReturnType {
	const receiptNeeded = ref<boolean>( initialValue );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( 'membership_address', 'setReceiptChoice' ), newValue );
	} );

	return {
		receiptNeeded,
	};
}
