import { FeeChangeRequest } from '@src/Domain/MembershipFeeChange/FeeChangeRequest';
import { FeeChangeResponse } from '@src/Domain/MembershipFeeChange/FeeChangeResponse';
import axios, { AxiosResponse } from 'axios';

export interface MembershipFeeChangeResource {
	put: ( data: FeeChangeRequest ) => Promise<FeeChangeResponse>;
}

export class ApiMembershipFeeChangeResource implements MembershipFeeChangeResource {

	putEndpoint: string;

	constructor( putEndpoint: string ) {
		this.putEndpoint = putEndpoint;
	}

	put( data: FeeChangeRequest ): Promise<FeeChangeResponse> {
		return axios.put(
			this.putEndpoint,
			data,
			{ headers: { 'Content-Type': 'application/json' } }
		).then( ( response: AxiosResponse<FeeChangeResponse> ) => {
			return Promise.resolve( response.data );
		} ).catch( ( error: any ) => {
			return Promise.reject( error.response.data.errors[ 0 ] );
		} );
	}
}
