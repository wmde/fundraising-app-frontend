import { Ref, ref, watch } from 'vue';
import { Store } from 'vuex';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

/**
 * The addressType is complicated and set between 2 separate fields:
 *     - Do you need a donation receipt?
 *         - Yes ()
 *         - No (EMAIL)
 *     - Who are you donating on behalf of?
 *         - Myself (PERSON)
 *         - My Workplace (COMPANY)
 *
 * When the donor toggles between yes and no it will toggle the addressType between EMAIL and the last selected type.
 * This is so second field will be reset correctly when it becomes visible if the donor had previously selected it.
 *
 * If the donor selects no to the first field and refreshes the page the addressType will be initialised as EMAIL. If
 * they then click yes on the first field the addressType will be set to EMAIL, which we don't want because the form
 * won't validate the address fields. That means in this case we check for EMAIL and if it's true we know it was a
 * reload, and we should set the addressType to UNSET. This leads to a case where the address type won't be restored
 * when the donor:
 *     1. Selects Yes to the first field
 *     2. Selects an option from the second field
 *     3. Selects No to the first field
 *     4. Reloads the page
 *     5. Selects Yes to the first field
 * This is unavoidable without also putting the last selected addressType into the store, but I think it's an
 * acceptable compromise. Because the addressType is set to UNSET the address fields after the addressType fields will
 * be validated as PERSON.
 *
 * @param receiptModel
 * @param addressType
 * @param store
 */
export function useAddressTypeFromReceiptSetter( receiptModel: Ref<boolean | null>, addressType: Ref<AddressTypeModel>, store: Store<any> ): void {
	const lastAddressType = ref<number>( addressType.value );

	if ( receiptModel.value && ![ AddressTypeModel.PERSON, AddressTypeModel.EMAIL, AddressTypeModel.COMPANY_WITH_CONTACT ].includes( addressType.value ) ) {
		store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.UNSET );
	}

	const setAddressTypeFromReceipt = ( receipt: boolean | null ): void => {
		if ( !receipt ) {
			lastAddressType.value = addressType.value;
			store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.EMAIL );
		} else {
			// If the last address type was email it means the donor changed
			// the donation receipt from no to yes after refreshing the page,
			// so we need to make it unset to turn back on the validation
			if ( lastAddressType.value === AddressTypeModel.EMAIL ) {
				lastAddressType.value = AddressTypeModel.UNSET;
			}

			store.dispatch( action( 'address', 'setAddressType' ), lastAddressType.value );
			lastAddressType.value = AddressTypeModel.UNSET;
		}
	};

	watch( receiptModel, setAddressTypeFromReceipt );
}
