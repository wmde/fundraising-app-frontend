import { GetterTree } from 'vuex';
import type { AddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';

export const getters: GetterTree<AddressState, any> = {
	invalidFields: ( state: AddressState ): Array<string> => {
		return state.requiredFields[ addressTypeName( state.addressType ) ].filter( fieldName => state.validity[ fieldName ] === Validity.INVALID );
	},
	requiredFieldsAreValid: ( state: AddressState, addressGetters: GetterTree<AddressState, any> ): boolean => {
		return addressGetters.invalidFields.length === 0;
	},
	/**
	 * @deprecated
	 */
	addressTypeModel: ( state: AddressState ): AddressTypeModel => state.addressType,
	/**
	 * @deprecated
	 */
	addressTypeIsNotAnon: ( state: AddressState ): boolean => state.addressType !== AddressTypeModel.ANON,
	/**
	 * @deprecated
	 */
	addressTypeIsNeitherAnonNorEmail: ( state: AddressState ): boolean => {
		return state.addressType !== AddressTypeModel.ANON && state.addressType !== AddressTypeModel.EMAIL;
	},
	/**
	 * @deprecated
	 */
	addressTypeIsInvalid: ( state: AddressState ): boolean => state.validity.addressType === Validity.INVALID,
	fullName: ( state: AddressState ): string => {
		// Duplicating code from DonorName PHP class
		const address = state.values;
		const nonEmpty = ( v: string ): boolean => !!v;
		const companyName = state.addressType === AddressTypeModel.COMPANY ? address.companyName : '';

		let companyNameWithContact = '';
		if ( state.addressType === AddressTypeModel.COMPANY_WITH_CONTACT ) {
			const contactName = [ address.salutation, address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' );
			companyNameWithContact = address.companyName + ( contactName !== '' ? `, ${contactName}` : '' );
		}

		// remove ternary operator in the following line when we implement contact person, https://phabricator.wikimedia.org/T220366
		let privateName = '';
		if ( state.addressType === AddressTypeModel.PERSON || state.addressType === AddressTypeModel.EMAIL ) {
			privateName = [ address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' );
		}
		return [ companyName, privateName, companyNameWithContact ].filter( nonEmpty ).join( ', ' );
	},
	isValidating: ( state: AddressState ): boolean => {
		return state.serverSideValidationCount > 0;
	},
	allRequiredFieldsEmpty: ( state: AddressState ): boolean => {
		return state.requiredFields[  addressTypeName( state.addressType ) ].map( field => state.values[ field ] === '' ).every( x => x );
	},
	// Some combinations of address type and information choices don't make sense, so we need getters that combine them
	willGetReceipt: ( state: AddressState, addressGetters ): boolean => {
		return state.receipt && addressGetters.addressTypeIsNeitherAnonNorEmail;
	},
	willGetNewsletter: ( state: AddressState, addressGetters ): boolean => {
		return state.newsletter && addressGetters.addressTypeIsNotAnon;
	},
};
