export enum AddressTypeModel {
    PERSON,
    COMPANY,
    COMPANY_WITH_CONTACT,
	EMAIL,
    ANON,
	UNSET,
}

export const AddressTypeNames = new Map<number, string>( [
	[ AddressTypeModel.PERSON, 'person' ],
	[ AddressTypeModel.COMPANY, 'firma' ],
	[ AddressTypeModel.COMPANY_WITH_CONTACT, 'company_with_contact' ],
	[ AddressTypeModel.EMAIL, 'email' ],
	[ AddressTypeModel.ANON, 'anonym' ],
	[ AddressTypeModel.UNSET, 'unset' ],
] );

export const AddressTypes = new Map<string, number>( [
	[ 'person', AddressTypeModel.PERSON ],
	[ 'firma', AddressTypeModel.COMPANY ],
	[ 'company_with_contact', AddressTypeModel.COMPANY_WITH_CONTACT ],
	[ 'email', AddressTypeModel.EMAIL ],
	[ 'anonym', AddressTypeModel.ANON ],
	[ 'unset', AddressTypeModel.UNSET ],
] );

export function addressTypeName( t: AddressTypeModel ): string {
	const name = AddressTypeNames.get( t );
	// poor man's type check to protect against future extensions of AddressTypeModel, e.g. https://phabricator.wikimedia.org/T220367
	if ( typeof name === 'undefined' ) {
		return AddressTypeNames.get( AddressTypeModel.UNSET ) as string;
	}
	return name;
}

export function addressTypeFromName( n: string ): AddressTypeModel {
	const type = AddressTypes.get( n );
	// poor man's type check to protect against future extensions of AddressTypeModel, e.g. https://phabricator.wikimedia.org/T220367
	if ( typeof type === 'undefined' ) {
		return AddressTypes.get( 'unset' ) as AddressTypeModel;
	}
	return type;
}
