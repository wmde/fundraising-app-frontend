import { computed } from 'vue';
import { action } from '@src/store/util';
import { AddressTypeModel, addressTypeName as getAddressTypeName } from '@src/view_models/AddressTypeModel';

export const useMembershipAddressTypeFunctions = ( store: any ) => {
	const addressType = computed( () => store.getters[ 'address/addressType' ] );
	const addressTypeName = computed( (): string => getAddressTypeName( store.state.address.addressType ) );
	const addressTypeIsInvalid = computed( (): boolean => store.getters[ 'address/addressTypeIsInvalid' ] );

	function setAddressType( newAddressType: AddressTypeModel ): void {
		store.dispatch( action( 'address', 'setAddressType' ), newAddressType );
	}

	return {
		addressType,
		addressTypeName,
		addressTypeIsInvalid,
		setAddressType,
	};
};
