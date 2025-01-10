import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

/** AddressTypeModel: String array of required fields */
export interface AddressRequirements {
	[ key: number ]: string[];
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

export const REQUIRED_FIELDS_DONOR_UPDATE: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.COMPANY ]: [ 'addressType', 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.COMPANY_WITH_CONTACT ]: [ 'addressType', 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
	// We show the person fields as default so if the address type before updating is email or anon we still need to validate them
	[ AddressTypeModel.EMAIL ]: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.ANON ]: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.UNSET ]: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
};

export const REQUIRED_FIELDS_ADDRESS_UPDATE: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city', 'country' ],
	[ AddressTypeModel.COMPANY_WITH_CONTACT ]: [ 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country' ],
};
