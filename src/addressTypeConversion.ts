import { AddressTypes } from '@src/view_models/Address';

export function addressTypeToServerValue( addressType: AddressTypes ): string {
	switch ( addressType ) {
		case 'anonymous':
			return 'anonym';
		case 'company':
			return 'firma';
		case 'person':
			return 'privat';
		default:
			return addressType;
	}
}

export function serverValueToAddressType( n: string ): AddressTypes {
	switch ( n ) {
		case 'privat':
			return 'person';
		case 'firma':
			return 'company';
		case 'company_with_contact':
			return 'company_with_contact';
		case 'anonym':
			return 'anonymous';
		default:
			return 'unset';
	}
}
