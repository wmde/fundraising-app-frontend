export const testBankTransferCode = 'XW-XLK-M3F-Z';

export const bankTransferConfirmationData = {
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
		bankTransferCode: testBankTransferCode,
		id: 1,
		interval: 0,
		optsIntoDonationReceipt: true,
		optsIntoNewsletter: false,
		paymentType: 'UEB',
		updateToken: 'd387cebd6cc05efbd117545492cb0e99',
	},
	countries: [
		{
			'countryCode': 'DE',
			'countryFullName': 'Deutschland',
			'isFrequentCountry': true,
			'postCodeValidation': '^[0-9]{5}$',
		},
		{
			'countryCode': 'AT',
			'countryFullName': 'Österreich',
			'isFrequentCountry': true,
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
};
