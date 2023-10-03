import { GetterTree } from 'vuex';
import { AddressState, AddressTypes } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';

export const getters: GetterTree<AddressState, any> = {
	invalidFields: ( state: AddressState ): Array<string> => {
		return state.requiredFields[ state.addressType ].filter( fieldName => state.validity[ fieldName ] !== Validity.VALID );
	},
	requiredFieldsAreValid: ( state: AddressState, addressGetters: GetterTree<AddressState, any> ): boolean => {
		return addressGetters.invalidFields.length === 0;
	},
	addressType: ( state: AddressState ): AddressTypes => state.addressType,
	addressTypeIsNotAnon: ( state: AddressState ): boolean => state.addressType !== 'anonymous',
	addressTypeIsNeitherAnonNorEmail: ( state: AddressState ): boolean => {
		return state.addressType !== 'anonymous' && state.addressType !== 'email';
	},
	addressTypeIsInvalid: ( state: AddressState ): boolean => state.validity.addressType === Validity.INVALID,
	fullName: ( state: AddressState ): string => {
		// Duplicating code from DonorName PHP class
		const address = state.values;
		const nonEmpty = ( v: string ): boolean => !!v;
		const companyName = state.addressType === 'company' ? address.companyName : '';

		let companyNameWithContact = '';
		if ( state.addressType === 'company_with_contact' ) {
			const contactName = [ address.salutation, address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' );
			companyNameWithContact = address.companyName + ( contactName !== '' ? `, ${contactName}` : '' );
		}

		let privateName = '';
		if ( state.addressType === 'person' || state.addressType === 'email' ) {
			privateName = [ address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' );
		}
		return [ companyName, privateName, companyNameWithContact ].filter( nonEmpty ).join( ', ' );
	},
	isValidating: ( state: AddressState ): boolean => {
		return state.serverSideValidationCount > 0;
	},
	allRequiredFieldsEmpty: ( state: AddressState ): boolean => {
		return state.requiredFields[ state.addressType ].map( field => state.values[ field ] === '' ).every( x => x );
	},
	// Some combinations of address type and information choices don't make sense, so we need getters that combine them
	willGetReceipt: ( state: AddressState, addressGetters ): boolean => {
		return state.receipt && addressGetters.addressTypeIsNeitherAnonNorEmail;
	},
	willGetNewsletter: ( state: AddressState, addressGetters ): boolean => {
		return state.newsletter && addressGetters.addressTypeIsNotAnon;
	},
};
