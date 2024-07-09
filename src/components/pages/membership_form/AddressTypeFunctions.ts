import { computed } from 'vue';
import { AddressTypeModel, addressTypeName as getAddressTypeName } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';

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
		store.dispatch( action( 'membership_address', 'setAddressType' ), newAddressType );
	}

	return {
		disabledAddressTypes,
		addressType,
		addressTypeName,

		setAddressType,
	};
};
