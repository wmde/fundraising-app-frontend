import { GetterTree } from 'vuex';
import type { MembershipAddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { REQUIRED_FIELDS } from '@src/store/membership_address/constants';

export const getters: GetterTree<MembershipAddressState, any> = {
	invalidFields: ( state: MembershipAddressState ): Array<string> => {
		return REQUIRED_FIELDS[ state.addressType ].filter( fieldName => state.validity[ fieldName ] !== Validity.VALID );
	},
	requiredFieldsAreValid: ( state: MembershipAddressState, addressGetters: GetterTree<MembershipAddressState, any> ): boolean => {
		return addressGetters.invalidFields.length === 0;
	},
	membershipTypeIsValid: ( state: MembershipAddressState ): boolean => state.validity.membershipType === Validity.VALID,
	dateOfBirthIsValid: ( state: MembershipAddressState ): boolean => state.validity.date !== Validity.INVALID,
	addressType: ( state: MembershipAddressState ): AddressTypeModel => state.addressType,
	membershipType: ( state: MembershipAddressState ): MembershipTypeModel => state.membershipType,
	isPerson: ( state: MembershipAddressState ): boolean => state.addressType === AddressTypeModel.PERSON,
	email: ( state: MembershipAddressState ): String => state.values.email,
	fullName: ( state: MembershipAddressState ): string => {
		// Duplicating code from DonorName PHP class
		const address = state.values;
		const nonEmpty = ( v: string ): boolean => !!v;
		const companyName = state.addressType === AddressTypeModel.COMPANY ? address.companyName : '';
		// remove ternary operator in the following line when we implement contact person, https://phabricator.wikimedia.org/T220366
		const privateName = state.addressType === AddressTypeModel.PERSON ? [ address.title, address.firstName, address.lastName ].filter( nonEmpty ).join( ' ' ) : '';
		return [ companyName, privateName ].filter( nonEmpty ).join( ', ' );
	},
	isValidating: ( state: MembershipAddressState ): boolean => {
		return state.serverSideValidationCount > 0;
	},
};
