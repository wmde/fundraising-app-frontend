import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

/** AddressTypeModel: String array of required fields */
export interface AddressRequirements {
	[ key: number ]: string[]
}

export const REQUIRED_FIELDS: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email', 'addressType' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city', 'country', 'email', 'addressType' ],
	[ AddressTypeModel.COMPANY_WITH_CONTACT ]: [ 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country', 'email', 'addressType' ],
	[ AddressTypeModel.EMAIL ]: [ 'email', 'salutation', 'firstName', 'lastName' ],
	[ AddressTypeModel.ANON ]: [],
	// We show the person address fields when the address type is UNSET so make sure to validate them
	[ AddressTypeModel.UNSET ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email', 'addressType' ],
};

export const REQUIRED_FIELDS_ADDRESS_UPDATE: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city', 'country' ],
	[ AddressTypeModel.COMPANY_WITH_CONTACT ]: [ 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country' ],
};
