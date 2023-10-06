import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { setReceiptChoice } from '@src/store/address/actionTypes';

type ReturnType = {
	receiptNeeded: Ref<boolean>,
};

export function useReceiptModel( store: Store<any>, initialValue: boolean ): ReturnType {
	const receiptNeeded = ref<boolean>( initialValue );

	watch( receiptNeeded, ( newValue: boolean | null ) => {
		store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setReceiptChoice ), newValue );
	} );

	return {
		receiptNeeded,
	};
}
