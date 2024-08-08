import { StreetAutocompleteResource } from '@src/api/StreetAutocompleteResource';

export class FakeStreetAutocompleteResource implements StreetAutocompleteResource {
	getStreetsInPostcode(): Promise<Array<string>> {
		return Promise.resolve( [
			'Cherry Tree Lane',
			'Jump Street',
			'Evergreen Terrace',
			'FÜN-Straße',
			'Elm Street',
			'Cobblestone Way',
			'Spooner Street',
			'Baker Street',
			'Sesame Street',
		] );
	}
}
