import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { UpdateMembershipApplicantRequest } from '@src/api/UpdateMembershipApplicantRequest';

export interface MembershipApplicantResource {
	put: ( data: UpdateMembershipApplicantRequest ) => Promise<MembershipAddress>;
}

export class ApiMembershipApplicantResource implements MembershipApplicantResource {

	constructor(
		private readonly putEndpoint: string
	) {
	}

	async put( data: UpdateMembershipApplicantRequest ): Promise<MembershipAddress> {
		const response = await fetch(
			this.putEndpoint,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( data ),
			}
		);

		const responseData = await response.json();

		if ( !response.ok ) {
			throw responseData.errors[ 0 ];
		}

		return responseData;
	}
}
