import { Address } from '@/view_models/Address';
import axios, { AxiosResponse } from 'axios';

interface DonorResource {
	putEndpoint: string,
	put: ( data: Address ) => Promise<Address>
}

export default class implements DonorResource {

	putEndpoint: string;

	constructor( putEndpoint: string ) {
		this.putEndpoint = putEndpoint;
	}

	put( data: Address ): Promise<Address> {
		return axios.put(
			this.putEndpoint,
			data,
			{ headers: { 'Content-Type': 'application/json' } }
		).then( ( response: AxiosResponse<Address> ) => {
			return Promise.resolve( response.data );
		} ).catch( ( error: any ) => {
			return Promise.reject( error.response.data.errors[ 0 ] );
		} );
	}
}
