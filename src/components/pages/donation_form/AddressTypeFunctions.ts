import { computed } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AddressTypes } from '@src/view_models/Address';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setAddressType as setAddressTypeActionType } from '@src/store/address/actionTypes';

export const useAddressTypeFunctions = ( store: any ) => {
	const disabledAddressTypes = computed(
		(): Array<AddressTypeModel> => {
			return store.getters[ 'payment/isDirectDebitPayment' ] ? [ AddressTypeModel.ANON ] : [];
		}
	);
	const addressType = computed( () => store.getters[ 'address/addressType' ] );
	const addressTypeIsNotAnon = computed( () => store.getters[ 'address/addressTypeIsNotAnon' ] );
	const addressTypeIsInvalid = computed( () => store.getters[ 'address/addressTypeIsInvalid' ] );

	function setAddressType( newAddressType: AddressTypes ): void {
		store.dispatch( action( NS_ADDRESS, setAddressTypeActionType ), newAddressType );
	}

	return {
		disabledAddressTypes,
		addressType,
		addressTypeIsNotAnon,
		addressTypeIsInvalid,

		setAddressType,
	};
};
