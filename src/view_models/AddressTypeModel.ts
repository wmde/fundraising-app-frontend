import { AddressTypes } from '@src/view_models/Address';

/**
 * This enum was conceived as a type for stores and components.
 * The benefit of using an enum is that specific values can be referenced.
 * The drawback is that it's kind of unwieldy.
 * The AddressTypes union type is the successor to AddressTypeModel.
 *
 * We might deprecate this enum and either convert it to an object with constants
 */
export enum AddressTypeModel {
    PERSON = 'person',
    COMPANY = 'company',
    COMPANY_WITH_CONTACT = 'company_with_contact',
	EMAIL = 'email',
    ANON = 'anonymous',
	UNSET = 'unset',
}

// AddressTypeNames and the AddressTypes maps have some German names in them because that's what the backend uses.

const AddressTypeNames = new Map<AddressTypes, string>( [
	[ AddressTypeModel.PERSON, 'person' ],
	[ AddressTypeModel.COMPANY, 'firma' ],
	[ AddressTypeModel.COMPANY_WITH_CONTACT, 'company_with_contact' ],
	[ AddressTypeModel.EMAIL, 'email' ],
	[ AddressTypeModel.ANON, 'anonym' ],
	[ AddressTypeModel.UNSET, 'unset' ],
] );

const AddressTypesMap = new Map<string, AddressTypes>( [
	[ 'person', AddressTypeModel.PERSON ],
	[ 'firma', AddressTypeModel.COMPANY ],
	[ 'company_with_contact', AddressTypeModel.COMPANY_WITH_CONTACT ],
	[ 'email', AddressTypeModel.EMAIL ],
	[ 'anonym', AddressTypeModel.ANON ],
	[ 'unset', AddressTypeModel.UNSET ],
] );

/**
 * @deprecated Use AddressTypes type directly or call `addressTypeToServerValue` if you need a value for the server
 * @param t
 */
export function addressTypeName( t: AddressTypeModel ): string {
	const name = AddressTypeNames.get( t );
	// poor man's type check to protect against future extensions of AddressTypeModel, e.g. https://phabricator.wikimedia.org/T220367
	if ( typeof name === 'undefined' ) {
		return AddressTypeNames.get( AddressTypeModel.UNSET ) as string;
	}
	return name;
}

/**
 * @deprecated Use AddressTypes directly or call serverValueToAddressType if you need to parse a server value
 * @param n
 */
export function addressTypeFromName( n: string ): AddressTypes {
	const type = AddressTypesMap.get( n );
	// poor man's type check to protect against future extensions of AddressTypeModel, e.g. https://phabricator.wikimedia.org/T220367
	if ( typeof type === 'undefined' ) {
		return AddressTypesMap.get( 'unset' );
	}
	return type;
}
