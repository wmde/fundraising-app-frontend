import { Address } from '@src/view_models/Address';
import axios, { AxiosResponse } from 'axios';
import { UpdateDonorRequest } from '@src/api/UpdateDonorRequest';

export interface DonorResource {
	put: ( data: UpdateDonorRequest ) => Promise<Address>;
}

export class ApiDonorResource implements DonorResource {

	putEndpoint: string;

	constructor( putEndpoint: string ) {
		this.putEndpoint = putEndpoint;
	}

	put( data: UpdateDonorRequest ): Promise<Address> {
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
