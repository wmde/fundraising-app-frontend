import axios, { AxiosResponse } from 'axios';

export interface StreetAutocompleteResource {
	getStreetsInPostcode( postcode: string ): Promise<Array<string>>;
}

export const NullStreetAutocompleteResource = {
	getStreetsInPostcode(): Promise<Array<string>> {
		return Promise.resolve( [] );
	},
};

export class ApiStreetAutocompleteResource implements StreetAutocompleteResource {
	async getStreetsInPostcode( postcode: string ): Promise<Array<string>> {
		const formData = new FormData();
		formData.append( 'postcode', postcode );
		return axios.post( '/api/v1/streets.json', formData )
			.then( ( streets: AxiosResponse<any> ) => {
				return streets.data;
			} );
	}
}
