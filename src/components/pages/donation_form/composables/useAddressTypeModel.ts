import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Store } from 'vuex';

export function useAddressTypeModel( store: Store<any> ): Ref<number | null> {
	const addressType = ref<number | null>( store.state.address.addressType );

	watch( addressType, ( newValue: number | null ) => {
		store.dispatch( action( 'address', 'setAddressType' ), newValue );
	} );

	return addressType;
}
