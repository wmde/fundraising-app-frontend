import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

export const AddressTypeIds = new Map<number, string>( [
	[ AddressTypeModel.ANON, 'anonymous' ],
	[ AddressTypeModel.EMAIL, 'email' ],
	[ AddressTypeModel.PERSON, 'person' ],
	[ AddressTypeModel.COMPANY, 'company' ],
	[ AddressTypeModel.UNSET, 'unset' ],
] );
