import { mount, VueWrapper } from '@vue/test-utils';
import MembershipSummary from '@src/components/shared/MembershipSummary.vue';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import { Salutation } from '@src/view_models/Salutation';

const privateAddress: MembershipAddress = {
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

const companyAddress: MembershipAddress = {
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

const monthlyApplication: MembershipApplication = {
	membershipFee: '15.00',
	membershipType: 'sustaining',
	paymentIntervalInMonths: 1,
	paymentType: 'BEZ',
	incentives: [],
};

const quarterlyApplication: MembershipApplication = {
	...monthlyApplication,
	membershipFee: '45.00',
	paymentIntervalInMonths: 3,
};

const yearlyApplication: MembershipApplication = {
	...monthlyApplication,
	membershipFee: '180.00',
	paymentIntervalInMonths: 12,
};

const salutations: Salutation[] = [
	{
		label: 'Herr',
		value: 'Herr',
		display: 'Herr',
		greetings: {
			formal: 'Good day',
			informal: 'Yo!',
			lastNameInformal: 'My Herr!',
		},
	},
	{
		label: 'Frau',
		value: 'Frau',
		display: 'Frau',
		greetings: {
			formal: 'Good day',
			informal: 'Yo!',
			lastNameInformal: 'My Frau!',
		},
	},
];

describe( 'MembershipSummary.vue', () => {

	const getWrapper = ( address: MembershipAddress, membershipApplication: MembershipApplication, addressIsInvalid: boolean = false ): VueWrapper<any> => {
		return mount( MembershipSummary, {
			props: {
				address,
				membershipApplication,
				salutations,
				addressIsInvalid,
			},
			global: {
				mocks: {
					$t: ( key: string, params?: Object ) => JSON.stringify( { key, ...params } ),
					$n: ( amount: string ) => amount,
				},
			},
		} );
	};

	it( 'renders personal membership confirmation data', () => {
		const wrapper = getWrapper( privateAddress, monthlyApplication );

		const content = JSON.parse( wrapper.find( '.form-summary-content p:last-child' ).text() );

		expect( content ).toStrictEqual( {
			key: 'membership_confirmation_data_text',
			paymentInterval: '{"key":"donation_form_payment_interval_1"}',
			membershipType: '{"key":"membership_type_sustaining"}',
			membershipFeeFormatted: '{"amount":15,"key":"currency","currencyDisplay":"name"}',
			membershipFeeYearlyFormatted: '({"amount":180,"key":"currency","currencyDisplay":"name"} {"key":"donation_form_payment_interval_12"})',
			paymentType: '{"key":"BEZ"}',
			address: 'Herr Prof. Dr. Testy MacTest, Tempelhofer Ufer 26, 10963 Berlin, {"key":"donation_form_country_option_DE"} E-Mail: testperson@wikimedia.de',
		} );

	} );

	it( 'renders company membership confirmation data', () => {
		const wrapper = getWrapper( companyAddress, monthlyApplication );

		const content = JSON.parse( wrapper.find( '.form-summary-content p:last-child' ).text() );

		expect( content ).toStrictEqual( {
			key: 'membership_confirmation_data_text',
			paymentInterval: '{"key":"donation_form_payment_interval_1"}',
			membershipType: '{"key":"membership_type_sustaining"}',
			membershipFeeFormatted: '{"amount":15,"key":"currency","currencyDisplay":"name"}',
			membershipFeeYearlyFormatted: '({"amount":180,"key":"currency","currencyDisplay":"name"} {"key":"donation_form_payment_interval_12"})',
			paymentType: '{"key":"BEZ"}',
			address: 'Test Company, Teststreet 123, 12345 Company City, {"key":"donation_form_country_option_DE"} E-Mail: testcompany@wikimedia.de',
		} );
	} );

	it( 'renders monthly payments', () => {
		const wrapper = getWrapper( companyAddress, monthlyApplication );

		const content = JSON.parse( wrapper.find( '.form-summary-content p:last-child' ).text() );

		expect( content ).toStrictEqual( {
			key: 'membership_confirmation_data_text',
			paymentInterval: '{"key":"donation_form_payment_interval_1"}',
			membershipType: '{"key":"membership_type_sustaining"}',
			membershipFeeFormatted: '{"amount":15,"key":"currency","currencyDisplay":"name"}',
			membershipFeeYearlyFormatted: '({"amount":180,"key":"currency","currencyDisplay":"name"} {"key":"donation_form_payment_interval_12"})',
			paymentType: '{"key":"BEZ"}',
			address: 'Test Company, Teststreet 123, 12345 Company City, {"key":"donation_form_country_option_DE"} E-Mail: testcompany@wikimedia.de',
		} );
	} );

	it( 'renders quarterly payments', () => {
		const wrapper = getWrapper( companyAddress, quarterlyApplication );

		const content = JSON.parse( wrapper.find( '.form-summary-content p:last-child' ).text() );

		expect( content ).toStrictEqual( {
			key: 'membership_confirmation_data_text',
			paymentInterval: '{"key":"donation_form_payment_interval_3"}',
			membershipType: '{"key":"membership_type_sustaining"}',
			membershipFeeFormatted: '{"amount":45,"key":"currency","currencyDisplay":"name"}',
			membershipFeeYearlyFormatted: '({"amount":180,"key":"currency","currencyDisplay":"name"} {"key":"donation_form_payment_interval_12"})',
			paymentType: '{"key":"BEZ"}',
			address: 'Test Company, Teststreet 123, 12345 Company City, {"key":"donation_form_country_option_DE"} E-Mail: testcompany@wikimedia.de',
		} );
	} );

	it( 'renders yearly payments', () => {
		const wrapper = getWrapper( companyAddress, yearlyApplication );

		expect( JSON.parse( wrapper.find( '.form-summary-content p:last-child' ).text() ) ).toStrictEqual( {
			key: 'membership_confirmation_data_text',
			paymentInterval: '{"key":"donation_form_payment_interval_12"}',
			membershipType: '{"key":"membership_type_sustaining"}',
			membershipFeeFormatted: '{"amount":180,"key":"currency","currencyDisplay":"name"}',
			membershipFeeYearlyFormatted: '',
			paymentType: '{"key":"BEZ"}',
			address: 'Test Company, Teststreet 123, 12345 Company City, {"key":"donation_form_country_option_DE"} E-Mail: testcompany@wikimedia.de',
		} );
	} );

	test( 'Does not render summary when address is invalid', () => {
		const wrapper = getWrapper( companyAddress, monthlyApplication, true );

		expect( wrapper.find( '.form-summary-content p:last-child' ).text() ).toContain( 'membership_form_review_address_is_invalid' );
		expect( wrapper.find( '.form-summary-content p:last-child' ).text() ).not.toContain( 'membershipFeeYearlyFormatted' );
	} );
} );
