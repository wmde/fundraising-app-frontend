import type { Address } from '@src/view_models/Address';
import type { Donation } from '@src/view_models/Donation';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';

export const testBankTransferCode = 'XW-XLK-M3F-Z';

export interface ConfirmationData {
	addressType: string;
	address: Address;
	donation: Donation;
	countries: Country[];
	salutations: Salutation[];
}

function createConfirmationData( overrides: any ): ConfirmationData {
	return Object.assign( {}, {
		addressType: 'person',
		address: {
			city: 'Berlin',
			countryCode: 'DE',
			email: 'test@wikimedia.de',
			firstName: 'Tester',
			fullName: 'Prof. Dr. Tester McTest',
			lastName: 'McTest',
			postalCode: '10963',
			salutation: 'Herr',
			streetAddress: 'Tempelhofer Ufer 23-24',
		},
		donation: {
			accessToken: 'a839bc8045aba4c8b600bc0477dbbf10',
			amount: 12.35,
			bankTransferCode: '',
			id: 1,
			interval: 0,
			receipt: true,
			newsletter: false,
			paymentType: '',
			updateToken: 'd387cebd6cc05efbd117545492cb0e99',
			isExported: false,
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
	}, overrides );
}

export const bankTransferConfirmationData = createConfirmationData( {
	donation: {
		paymentType: 'UEB',
		bankTransferCode: testBankTransferCode,
		amount: 12.35,
		updateToken: 'd387cebd6cc05efbd117545492cb0e99',
		accessToken: 'a839bc8045aba4c8b600bc0477dbbf10',
		id: 1,
		interval: 0,
		receipt: true,
		newsletter: false,
		isExported: false,
	},
} );

export const anonymousBankTransferConfirmationData = createConfirmationData( {
	addressType: 'anonym',
	address: {},
	donation: {
		paymentType: 'UEB',
		bankTransferCode: testBankTransferCode,
		amount: 12.35,
	},
} );

export const emailBankTransferConfirmationData = createConfirmationData( {
	addressType: 'email',
	address: {},
	donation: {
		paymentType: 'UEB',
		bankTransferCode: testBankTransferCode,
		amount: 12.35,
	},
} );

export const payPalConfirmationData = createConfirmationData( {
	donation: {
		paymentType: 'PPL',
		bankTransferCode: testBankTransferCode,
	},
} );

export const companyPayPalConfirmationData = createConfirmationData( {
	addressType: 'firma',
	donation: {
		paymentType: 'PPL',
		bankTransferCode: testBankTransferCode,
	},
} );

export const directDebitConfirmationData = createConfirmationData( {
	donation: {
		paymentType: 'BEZ',
		bankTransferCode: testBankTransferCode,
	},
} );

export const donationExportedConfirmationData = createConfirmationData( {
	donation: {
		paymentType: 'PPL',
		bankTransferCode: testBankTransferCode,
		isExported: true,
	},
} );

export const companyExportedPayPalConfirmationData = createConfirmationData( {
	addressType: 'firma',
	donation: {
		paymentType: 'PPL',
		bankTransferCode: testBankTransferCode,
		isExported: true,
	},
} );

export const anonymousExportedPayPalConfirmationData = createConfirmationData( {
	addressType: 'anonym',
	donation: {
		paymentType: 'PPL',
		bankTransferCode: testBankTransferCode,
		isExported: true,
	},
} );

export const emailExportedPayPalConfirmationData = createConfirmationData( {
	addressType: 'anonym',
	donation: {
		paymentType: 'PPL',
		bankTransferCode: testBankTransferCode,
		isExported: true,
	},
} );
