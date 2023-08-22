import { mount, VueWrapper } from '@vue/test-utils';
import MembershipSummary from '@src/components/shared/MembershipSummary.vue';
import { createStore } from '@src/store/donation_store';

const privateAddress = {
	applicantType: 'person',
	city: 'Berlin',
	countryCode: 'DE',
	email: 'testperson@wikimedia.de',
	fullName: 'Prof. Dr. Testy MacTest',
	postalCode: '10963',
	salutation: 'Herr',
	streetAddress: 'Tempelhofer Ufer 26',
	title: 'Prof. Dr.',
};

const companyAddress = {
	applicantType: 'firma',
	city: 'Company City',
	countryCode: 'DE',
	email: 'testcompany@wikimedia.de',
	fullName: 'Test Company',
	postalCode: '12345',
	salutation: 'Firma',
	streetAddress: 'Teststreet 123',
	title: '',
};

const monthlyPayment = {
	id: 1,
	membershipFee: '15.00',
	membershipType: 'sustaining',
	paymentIntervalInMonths: 1,
	paymentType: 'BEZ',
	status: 'status-booked',
	updateToken: '16a9e7a092959b9507e86a0c94dfbb9c',
};

const quarterlyPayment = {
	...monthlyPayment,
	membershipFee: '45.00',
	paymentIntervalInMonths: 3,
};

const yearlyPayment = {
	...monthlyPayment,
	membershipFee: '180.00',
	paymentIntervalInMonths: 12,
};

const salutations = [
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
];

const mockTranslate = function ( key: string, params?: Object ) {
	return key + ( params ? ': ' + JSON.stringify( params, null, 2 ) : '' );
};

describe( 'MembershipSummary.vue', () => {

	const getWrapper = ( address: Object, membershipApplication: Object, addressIsInvalid: boolean = false ): VueWrapper<any> => {
		return mount( MembershipSummary, {
			props: {
				address,
				membershipApplication,
				salutations,
				addressIsInvalid,
			},
			global: {
				mocks: {
					$t: mockTranslate,
					$n: ( amount: string ) => amount,
				},
			},
		} );
	};

	it( 'renders personal membership confirmation data', () => {
		const wrapper = getWrapper( privateAddress, monthlyPayment );

		expect( wrapper.find( '.payment-summary' ).text() ).toContain(
			'Herr Prof. Dr. Testy MacTest, Tempelhofer Ufer 26, 10963 Berlin, donation_form_country_option_DE E-Mail: testperson@wikimedia.de'
		);
	} );

	it( 'renders company membership confirmation data', () => {
		const wrapper = getWrapper( companyAddress, monthlyPayment );

		expect( wrapper.find( '.payment-summary' ).text() ).toContain(
			'Test Company, Teststreet 123, 12345 Company City, donation_form_country_option_DE E-Mail: testcompany@wikimedia.de'
		);
	} );

	// If the backslashes below are put in correctly, they will get double-escaped and won't match
	/* eslint-disable no-useless-escape */

	it( 'renders monthly payments', () => {
		const wrapper = getWrapper( companyAddress, monthlyPayment );

		expect( wrapper.find( '.payment-summary' ).text() ).toContain( '\"membershipFeeFormatted\": 15' );
		expect( wrapper.find( '.payment-summary' ).text() ).toContain( '\"membershipFeeYearlyFormatted\": \"(180 donation_form_payment_interval_12)\"' );
	} );

	it( 'renders quarterly payments', () => {
		const wrapper = getWrapper( companyAddress, quarterlyPayment );

		expect( wrapper.find( '.payment-summary' ).text() ).toContain( '\"membershipFeeFormatted\": 45' );
		expect( wrapper.find( '.payment-summary' ).text() ).toContain( '\"membershipFeeYearlyFormatted\": \"(180 donation_form_payment_interval_12)\"' );
	} );

	it( 'renders yearly payments', () => {
		const wrapper = getWrapper( companyAddress, yearlyPayment );

		expect( wrapper.find( '.payment-summary' ).text() ).toContain( '\"membershipFeeFormatted\": 180' );
		expect( wrapper.find( '.payment-summary' ).text() ).toContain( '\"membershipFeeYearlyFormatted\": \"\"' );
	} );

	test( 'Does not render summary when address is invalid', () => {
		const wrapper = getWrapper( companyAddress, monthlyPayment, true );

		expect( wrapper.find( '.payment-summary' ).text() ).toContain( 'membership_form_review_address_is_invalid' );
		expect( wrapper.find( '.payment-summary' ).text() ).not.toContain( 'membershipFeeYearlyFormatted' );
	} );

	/* eslint-enable no-useless-escape */
} );
