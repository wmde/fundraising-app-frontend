import { computed } from 'vue';
import { AddressTypeModel, addressTypeName as getAddressTypeName } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';

export const useAddressTypeFunctions = ( store: any ) => {
	const disabledAddressTypes = computed(
		(): Array<AddressTypeModel> => {
			return store.getters[ 'payment/isDirectDebitPayment' ] ? [ AddressTypeModel.ANON ] : [];
		}
	);
	const addressType = computed( () => store.getters[ 'address/addressType' ] );
	const addressTypeIsNotAnon = computed( () => store.getters[ 'address/addressTypeIsNotAnon' ] );
	const addressTypeIsInvalid = computed( () => store.getters[ 'address/addressTypeIsInvalid' ] );

	const addressTypeName = computed(
		(): string => getAddressTypeName( store.state.address.addressType )
	);

	function setAddressType( newAddressType: AddressTypeModel ): void {
		store.dispatch( action( 'address', 'setAddressType' ), newAddressType );
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
