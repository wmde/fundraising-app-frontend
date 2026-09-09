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
		return {
			fullName: responseData.fullName,
			salutation: responseData.salutation,
			title: responseData.title,
			firstName: responseData.firstName,
			lastName: responseData.lastName,
			companyName: responseData.companyName,
			email: responseData.email,
			streetAddress: responseData.street,
			postalCode: responseData.postcode,
			city: responseData.city,
			countryCode: responseData.country,
			applicantType: responseData.addressType,
		};
	}
}
