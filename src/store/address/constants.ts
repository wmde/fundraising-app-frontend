import { AddressTypeModel } from '@/view_models/AddressTypeModel';

/** AddressTypeModel: String array of required fields **/
export interface AddressRequirements {
	[ key: number ]: string[]
}

export const REQUIRED_FIELDS: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city', 'email' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city', 'email' ],
	[ AddressTypeModel.ANON ]: [],
};

export const REQUIRED_FIELDS_ADDRESS_UPDATE: AddressRequirements = {
	[ AddressTypeModel.PERSON ]: [ 'salutation', 'firstName', 'lastName', 'street', 'postcode', 'city' ],
	[ AddressTypeModel.COMPANY ]: [ 'companyName', 'street', 'postcode', 'city' ],
};
