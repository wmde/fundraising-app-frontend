import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

export interface AddressOptOutModel {
	addressOptIn: Ref<boolean | null>;
	previousAddressType: Ref<AddressTypeModel>;
}

function getInitialAddressOptInValue( store: Store<any> ): boolean | null {
	if ( store.state.address.addressType === AddressTypeModel.UNSET ) {
		return null;
	}
	return store.state.address.addressType !== AddressTypeModel.ANON;
}

export function useAddressOptOutModel( store: Store<any> ): AddressOptOutModel {
	const addressOptIn = ref<boolean | null>( getInitialAddressOptInValue( store ) );
	const previousAddressType = ref<AddressTypeModel>( AddressTypeModel.PERSON );

	watch( addressOptIn, ( newValue: boolean | null ) => {
		if ( newValue === true ) {
			store.dispatch( action( 'address', 'setAddressType' ), previousAddressType.value );
		} else {
			const currentAddressType = store.state.address.addressType;
			if ( currentAddressType !== AddressTypeModel.ANON && currentAddressType !== AddressTypeModel.UNSET ) {
				previousAddressType.value = currentAddressType;
			}
			store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.ANON );
		}
	} );

	return {
		addressOptIn,
		previousAddressType,
	};
}
