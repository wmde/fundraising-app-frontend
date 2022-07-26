import { computed } from 'vue';
import { AddressTypeModel, addressTypeName as getAddressTypeName } from '@/view_models/AddressTypeModel';
import { action } from '@/store/util';
import { NS_ADDRESS } from '@/store/namespaces';
import { setAddressType as setAddressTypeActionType } from '@/store/address/actionTypes';

export const useAddressTypeFunctions = ( store: any ) => {
	const disabledAddressTypes = computed(
		(): Array<AddressTypeModel> => {
			return store.getters[ 'payment/isDirectDebitPayment' ] ? [ AddressTypeModel.EMAIL, AddressTypeModel.ANON ] : [];
		}
	);
	const addressType = computed( () => store.getters[ 'address/addressType' ] );
	const addressTypeIsNotAnon = computed( () => store.getters[ 'address/addressTypeIsNotAnon' ] );
	const addressTypeIsInvalid = computed( () => store.getters[ 'address/addressTypeIsInvalid' ] );

	const addressTypeName = computed(
		(): string => getAddressTypeName( store.state.address.addressType )
	);

	function setAddressType( newAddressType: AddressTypeModel ): void {
		store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), newAddressType );
	}

	return {
		disabledAddressTypes,
		addressType,
		addressTypeIsNotAnon,
		addressTypeIsInvalid,
		addressTypeName,

		setAddressType,
	};
};
