import { GetterTree } from 'vuex';
import type { AddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { getAddressType, getRequiredFields } from '@src/store/address/addressTypeFunctions';
import { AddressType } from '@src/store/address/constants';

export const getters: GetterTree<AddressState, any> = {
	invalidFields: ( state: AddressState ): Array<string> => {
		return getRequiredFields( state ).filter( fieldName => state.validity[ fieldName ] === Validity.INVALID );
	},
	requiredFieldsAreValid: ( state: AddressState, addressGetters: GetterTree<AddressState, any> ): boolean => {
		return addressGetters.invalidFields.length === 0;
	},
	addressType: ( state: AddressState ): AddressType => getAddressType( state ),
	fullName: ( state: AddressState ): string => {
		// Duplicating code from DonorName PHP class
		const address = state.values;
		const nonEmpty = ( v: string ): boolean => !!v;

		let companyNameWithContact = '';
		if ( getAddressType( state ) === 'company_with_contact' ) {
			const contactName = [ address.salutation, address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' );
			companyNameWithContact = address.companyName + ( contactName !== '' ? `, ${contactName}` : '' );
		}

		// remove ternary operator in the following line when we implement contact person, https://phabricator.wikimedia.org/T220366
		let privateName = '';
		if ( [ 'person', 'email' ].includes( getAddressType( state ) ) ) {
			privateName = [ address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' );
		}
		return [ privateName, companyNameWithContact ].filter( nonEmpty ).join( ', ' );
	},
	isValidating: ( state: AddressState ): boolean => {
		return state.serverSideValidationCount > 0;
	},
};
