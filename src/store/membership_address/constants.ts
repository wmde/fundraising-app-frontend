import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

export const ALLOWED_ADDRESS_TYPES: AddressTypeModel[] = [
	AddressTypeModel.PERSON,
	AddressTypeModel.COMPANY,
];

export const REQUIRED_FIELDS: { [key: number]: string[] } = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
};

export const REQUIRED_FIELDS_MEMBERSHIP_APPLICANT_UPDATE: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'addressType', 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.COMPANY ]: [ 'addressType', 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
};

export const DEFAULT_FIELDS: DefaultFields = {
	country: 'DE',
};

export interface AddressRequirements {
	[ key: number ]: string[];
}

export interface DefaultFields {
	[key: string]: string;
}
