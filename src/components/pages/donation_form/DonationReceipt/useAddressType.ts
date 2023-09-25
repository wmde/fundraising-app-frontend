import { computed, ComputedRef } from 'vue';
import { Store } from 'vuex';
import { addressTypeName as getAddressTypeName } from '@src/view_models/AddressTypeModel';

type ReturnType = {
	addressType: ComputedRef<number>,
	addressTypeName: ComputedRef<string>,
};

export function useAddressType( store: Store<any> ): ReturnType {
	const addressType = computed<number>( () => store.getters[ 'address/addressType' ] );
	const addressTypeName = computed<string>( (): string => getAddressTypeName( store.state.address.addressType ) );

	return {
		addressType,
		addressTypeName,
	};
}
