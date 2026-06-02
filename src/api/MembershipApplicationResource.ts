import axios, { AxiosResponse } from 'axios';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { UpdateMembershipApplicationRequest } from '@src/api/UpdateMembershipApplicationRequest';

export interface MembershipApplicationResource {
	put( data: UpdateMembershipApplicationRequest ): Promise<MembershipAddress>;
}

export class ApiMembershipApplicationResource implements MembershipApplicationResource {

	constructor(
		private readonly putEndpoint: string
	) {
	}

	put( data: UpdateMembershipApplicationRequest ): Promise<MembershipAddress> {
		return axios.put(
			this.putEndpoint,
			data,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(
			( response: AxiosResponse<MembershipAddress> ) => response.data
		).catch(
			( error ) => Promise.reject( error.response.data.errors[ 0 ] )
		);
	}
}
