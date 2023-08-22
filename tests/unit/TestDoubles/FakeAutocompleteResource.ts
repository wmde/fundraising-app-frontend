import { CityAutocompleteResource } from '@src/CityAutocompleteResource';

export class FakeAutocompleteResource implements CityAutocompleteResource {
	getCitiesInPostcode(): Promise<Array<string>> {
		return Promise.resolve( [
			'Takeshi\'s Castle',
			'Mushroom Kingdom City',
			'Alabastia',
			'FÜN-Stadt',
			'Ba Sing Se',
			'Satan City',
			'Gotham City',
			'Kleinstes-Kaff-der-Welt',
			'Entenhausen',
		] );
	}
}
