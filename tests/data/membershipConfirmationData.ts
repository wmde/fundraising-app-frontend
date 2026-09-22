import type { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';

export interface MembershipConfirmationData {
	address: MembershipAddress;
	membershipApplication: MembershipApplication;
	countries: Country[];
	salutations: Salutation[];
	updateToken: string;
}

function createMembershipConfirmationData( overrides: any ): MembershipConfirmationData {
	return Object.assign( {}, {
		address: {
			applicantType: 'person',
			city: 'Berlin',
			companyName: '',
			countryCode: 'DE',
			email: 'test@wikimedia.de',
			firstName: 'Tester',
			fullName: 'Prof. Dr. Tester McTest',
			lastName: 'McTest',
			postalCode: '10963',
			salutation: 'Herr',
			streetAddress: 'Tempelhofer Ufer 23-24',
			title: 'Prof. Dr.',
		},
		membershipApplication: {
			id: 1,
			membershipType: 'sustaining',
			paymentType: 'BEZ',
			paymentIntervalInMonths: 1,
			membershipFee: 2400,
			incentives: [],
			isExported: false,
			updateToken: 'd387cebd6cc05efbd117545492cb0e99',
		},
		countries: [
			{
				'countryCode': 'DE',
				'countryFullName': 'Deutschland',
				'group': '',
				'postCodeValidation': '^[0-9]{5}$',
			},
			{
				'countryCode': 'AT',
				'countryFullName': 'Österreich',
				'group': '',
				'postCodeValidation': '^[0-9]{4}$',
			},
		],
		salutations: [
			{
				'label': 'Herr',
				'value': 'Herr',
				'display': 'Herr',
			},
			{
				'label': 'Frau',
				'value': 'Frau',
				'display': 'Frau',
			},
		],
		updateToken: 'd387cebd6cc05efbd117545492cb0e99',
	}, overrides );
}

export const sustainingMembershipConfirmationData = createMembershipConfirmationData( {} );

export const activeMembershipConfirmationData = createMembershipConfirmationData( {
	membershipApplication: {
		id: 1,
		membershipType: 'active',
		paymentType: 'BEZ',
		paymentIntervalInMonths: 1,
		membershipFee: 2400,
		incentives: [],
		isExported: false,
		updateToken: 'd387cebd6cc05efbd117545492cb0e99',
	},
} );
