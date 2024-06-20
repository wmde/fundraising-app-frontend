import { Address } from '@src/view_models/Address';
import axios, { AxiosResponse } from 'axios';
import { UpdateAddressResponse } from '@src/api/UpdateAddressResponse';

export interface AddressChangeResource {
	put: ( data: Address ) => Promise<UpdateAddressResponse>;
}

export class ApiAddressChangeResource implements AddressChangeResource {

	putEndpoint: string;

	constructor( putEndpoint: string ) {
		this.putEndpoint = putEndpoint;
	}

	put( data: Address ): Promise<UpdateAddressResponse> {
		return axios.put(
			this.putEndpoint,
			data,
			{ headers: { 'Content-Type': 'application/json' } }
		).then( ( response: AxiosResponse<UpdateAddressResponse> ) => {
			return Promise.resolve( response.data );
		} ).catch( ( error: any ) => {
			return Promise.reject( error.response.data.errors[ 0 ] );
		} );
	}
}
