import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setAddressType as setAddressTypeActionType } from '@src/store/address/actionTypes';
import { Store } from 'vuex';

export function useAddressTypeModel( store: Store<any> ): Ref<number | null> {
	const addressType = ref<number | null>( store.state.address.addressType );

	watch( addressType, ( newValue: number | null ) => {
		store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), newValue );
	} );

	return addressType;
}
