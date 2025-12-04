import { Ref, watch } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Store } from 'vuex';
import { action } from '@src/store/util';
import { AddressFormData } from '@src/view_models/Address';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';

type ReturnType = { updateAddressType: () => Promise<void> };

export function useAddressTypeUpdater(
	receiptNeeded: Ref<boolean>,
	isCompany: Ref<boolean | null>,
	addressType: Ref<AddressTypeModel>,
	formData: AddressFormData,
	store: Store<any>
): ReturnType {
	if ( addressType.value === AddressTypeModel.UNSET ) {
		store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.EMAIL );
	}

	const updateAddressType = async (): Promise<void> => {

		if ( isCompany.value ) {
			// If company checkbox is checked then its always company
			await store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.COMPANY_WITH_CONTACT );
		} else if ( receiptNeeded.value ) {
			// If the receipt is needed then set the address type based in if the company checkbox is checked
			await store.dispatch( action( 'address', 'setAddressType' ), isCompany.value ? AddressTypeModel.COMPANY_WITH_CONTACT : AddressTypeModel.PERSON );
		} else {
			// Check the address fields to see if it's person or email
			if ( clearStreetAndBuildingNumberSeparator( formData.street.value ) === '' && formData.postcode.value === '' && formData.city.value === '' ) {
				await store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.EMAIL );
			} else {
				await store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.PERSON );
			}
		}
	};

	watch( [ receiptNeeded, isCompany ], updateAddressType );

	return {
		updateAddressType,
	};
}
