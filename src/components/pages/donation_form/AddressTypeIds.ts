import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AddressTypes } from '@src/view_models/Address';

export const AddressTypeIds = new Map<AddressTypes, string>( [
	[ AddressTypeModel.ANON, 'anonymous' ],
	[ AddressTypeModel.EMAIL, 'email' ],
	[ AddressTypeModel.PERSON, 'person' ],
	[ AddressTypeModel.COMPANY, 'company' ],
	[ AddressTypeModel.UNSET, 'unset' ],
] );
