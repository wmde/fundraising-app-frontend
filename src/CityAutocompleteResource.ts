import axios, { AxiosResponse } from 'axios';

export interface CityAutocompleteResource {
	getCitiesInPostcode( postcode: string ): Promise<Array<string>>
}

export const NullCityAutocompleteResource = {
	getCitiesInPostcode(): Promise<Array<string>> {
		return Promise.resolve( [] );
	},
};

export class ApiCityAutocompleteResource implements CityAutocompleteResource {
	async getCitiesInPostcode( postcode: string ): Promise<Array<string>> {
		const formData = new FormData();
		formData.append( 'postcode', postcode );
		return axios.post( '/api/v1/cities.json', formData )
			.then( ( cities: AxiosResponse<any> ) => {
				return cities.data;
			} );
	}
}
