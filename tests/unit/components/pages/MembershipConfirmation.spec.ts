import { mount } from '@vue/test-utils';
import type { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import type { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { MembershipApplicationConfirmationData } from '@src/Domain/Membership/MembershipApplicationConfirmationData';
import salutations from '@test/data/salutations';
import countries from '@test/data/countries';
import MembershipConfirmation from '@src/components/pages/MembershipConfirmation.vue';

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
	isExported: false,
};

const yearlyApplication: MembershipApplication = {
	...monthlyApplication,
	membershipFee: '199.00',
	paymentIntervalInMonths: 12,
};

describe( 'MembershipConfirmation.vue', () => {
	const getWrapper = ( membershipApplication: MembershipApplication, address: MembershipAddress, translationMock?: ( key: string, params?: Object ) => string ) => {
		const translateFn = translationMock === undefined ? ( key: string, params?: Object ) => JSON.stringify( [ key, params ] ) : translationMock;
		const confirmationData: MembershipApplicationConfirmationData = {
			piwik: {
				membershipApplicationConfirmationGoalId: 123,
			},
			membershipApplication,
			address,
			countries,
			salutations,
		};
		return mount( MembershipConfirmation, {
			props: {
				confirmationData,
				countries,
				salutations,
			},
			global: {
				mocks: {
					$t: translateFn,
					$n: ( amount: string ) => amount,
				},
			},
		} );
	};

	test( 'displays the correct membership fee', () => {
		const wrapper = getWrapper( yearlyApplication, privateAddress );
		const summaryElement = wrapper.find( '.content-card:first-child' );

		expect( summaryElement.text() ).toContain( '199' );
		expect( summaryElement.text() ).toContain( 'donation_form_payment_interval_12' );
		expect( summaryElement.text() ).toContain( 'BEZ' );
		expect( summaryElement.text() ).toContain( 'sustaining' );
	} );

	test( 'displays the calculated yearly membership fee', () => {
		const wrapper = getWrapper( monthlyApplication, privateAddress );
		const summaryElement = wrapper.find( '.content-card:first-child' );

		expect( summaryElement.text() ).toContain( '15' );
		expect( summaryElement.text() ).toContain( '180' );
		expect( summaryElement.text() ).toContain( 'donation_form_payment_interval_1' );
		expect( summaryElement.text() ).toContain( 'donation_form_payment_interval_12' );
	} );

	test( 'displays the correct address for a private person', () => {
		const wrapper = getWrapper( yearlyApplication, privateAddress );
		const addressElement = wrapper.find( '.switcher > .flow:first-child > .content-card' );

		expect( addressElement.text() ).toContain( 'Prof. Dr. Testy MacTest' );
		expect( addressElement.text() ).toContain( 'Tempelhofer Ufer 26' );
		expect( addressElement.text() ).toContain( '10963 Berlin' );
		expect( addressElement.text() ).toContain( 'Deutschland' );
		expect( addressElement.text() ).toContain( 'testperson@wikimedia.de' );
	} );

	test( 'displays the correct address for a company', () => {
		const wrapper = getWrapper( yearlyApplication, companyAddress );
		const addressElement = wrapper.find( '.switcher > .flow:first-child > .content-card' );

		expect( addressElement.text() ).toContain( 'Test Company' );
		expect( addressElement.text() ).toContain( 'Teststreet 123' );
		expect( addressElement.text() ).toContain( '12345 Company City' );
		expect( addressElement.text() ).toContain( 'Deutschland' );
		expect( addressElement.text() ).toContain( 'testcompany@wikimedia.de' );
	} );

	test( 'displays different text when membership has incentives', () => {
		const wrapperWithoutIncentives = getWrapper( yearlyApplication, privateAddress );
		const wrapperWithIncentives = getWrapper( { ...yearlyApplication, incentives: [ 'incentive1', 'incentive2' ] }, privateAddress );

		expect( wrapperWithoutIncentives.text() ).toContain( 'membership_confirmation_success_text' );
		expect( wrapperWithIncentives.text() ).toContain( 'membership_confirmation_success_text_incentive' );
	} );

	test( 'displays additional text when payment is bank transfer', () => {
		const wrapper = getWrapper( { ...yearlyApplication, paymentType: 'UEB' }, privateAddress );

		expect( wrapper.text() ).toContain( 'membership_confirmation_success_text_bank_transfer' );
	} );

	test( 'tells the member that their address was anonymised', () => {
		const wrapper = getWrapper( { ...monthlyApplication, isExported: true }, privateAddress );

		expect( wrapper.text() ).toContain( 'membership_confirmation_exported_title' );
		expect( wrapper.text() ).toContain( 'membership_confirmation_exported_content' );
	} );

	test( 'shows the survey tile if survey link language item is not empty', () => {
		const translateMock = ( key: string ): string => {
			if ( key === 'membership_confirmation_survey_link' ) {
				return 'https://example.com/survey';
			}

			return key;
		};
		const wrapper = getWrapper( yearlyApplication, privateAddress, translateMock );

		expect( wrapper.text() ).toContain( 'membership_confirmation_survey_title' );
	} );

	test( 'hides the survey tile if survey link language item is blank', () => {
		const translateMock = ( key: string ): string => {
			if ( key === 'membership_confirmation_survey_link' ) {
				return '';
			}

			return key;
		};
		const wrapper = getWrapper( yearlyApplication, privateAddress, translateMock );

		expect( wrapper.text() ).not.toContain( 'membership_confirmation_survey_title' );
	} );

} );
