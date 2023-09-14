import { ComputedRef, Ref, ref, watch } from 'vue';
import { Store } from 'vuex';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setAddressType as setAddressTypeActionType } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

export function useAddressTypeFromReceiptSetter( receiptModel: Ref<boolean | null>, addressType: ComputedRef<number>, store: Store<any> ): void {
	const lastAddressType = ref<number>( addressType.value );

	if ( !receiptModel.value ) {
		store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), AddressTypeModel.EMAIL );
	} else if ( ![ AddressTypeModel.PERSON, AddressTypeModel.COMPANY_WITH_CONTACT ].includes( addressType.value ) ) {
		store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), AddressTypeModel.UNSET );
	}

	const setAddressTypeFromReceipt = ( receipt: boolean | null ): void => {
		if ( !receipt ) {
			lastAddressType.value = addressType.value;
			store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), AddressTypeModel.EMAIL );
		} else {
			store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), lastAddressType.value );
			lastAddressType.value = AddressTypeModel.UNSET;
		}
	};

	watch( receiptModel, setAddressTypeFromReceipt );
}
