import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

export const ALLOWED_ADDRESS_TYPES: AddressTypeModel[] = [
	AddressTypeModel.PERSON,
	AddressTypeModel.COMPANY,
];

export const REQUIRED_FIELDS: { [key: number]: string[] } = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'country', 'email' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city', 'country', 'email' ],
};
