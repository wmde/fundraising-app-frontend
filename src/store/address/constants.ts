export type AddressType = 'person' | 'firma' | 'company_with_contact' | 'email' | 'anonym' | 'unset';

export type AddressRequirements = {
	[ key in AddressType ]: string[];
};

export interface DefaultFields {
	[ key: string ]: string;
}

export const REQUIRED_FIELDS: AddressRequirements = {
	person: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email', 'isAnonymous' ],
	firma: [ 'companyName', 'street', 'postcode', 'city', 'country', 'email', 'isAnonymous' ],
	'company_with_contact': [ 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country', 'email', 'isAnonymous' ],
	email: [ 'email', 'salutation', 'firstName', 'lastName' ],
	anonym: [],
	// We show the person address fields when the address type is UNSET so make sure to validate them
	unset: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email', 'isAnonymous' ],
};

export const REQUIRED_FIELDS_DONOR_UPDATE: AddressRequirements = {
	person: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	firma: [ 'addressType', 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
	'company_with_contact': [ 'addressType', 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
	// We show the person fields as default so if the address type before updating is email or anon we still need to validate them
	email: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	anonym: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	unset: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
};

/**
 * @deprecated we've never used the address update and will remove it
 */
export const REQUIRED_FIELDS_ADDRESS_UPDATE: AddressRequirements = {
	person: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country' ],
	firma: [ 'companyName', 'street', 'postcode', 'city', 'country' ],
	'company_with_contact': [ 'salutation', 'firstName', 'lastName', 'companyName', 'street', 'postcode', 'city', 'country' ],
	anonym: [], email: [], unset: [],
};

export const DEFAULT_FIELDS: DefaultFields = {
	country: 'DE',
};
