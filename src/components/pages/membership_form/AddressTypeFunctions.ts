import { computed } from 'vue';
import { AddressTypeModel, addressTypeName as getAddressTypeName } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { setAddressType as setAddressTypeActionType } from '@src/store/address/actionTypes';

export const useAddressTypeFunctions = ( store: any ) => {
	const disabledAddressTypes = computed(
		(): Array<AddressTypeModel> => {
			return store.getters[ 'payment/isDirectDebitPayment' ] ? [ AddressTypeModel.ANON ] : [];
		}
	);
	const addressType = computed( () => store.getters[ 'membership_address/addressType' ] );

	const addressTypeName = computed(
		(): string => getAddressTypeName( store.state.membership_address.type )
	);

	function setAddressType( newAddressType: AddressTypeModel ): void {
		store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setAddressTypeActionType ), newAddressType );
	}

	return {
		disabledAddressTypes,
		addressType,
		addressTypeName,

		setAddressType,
	};
};
