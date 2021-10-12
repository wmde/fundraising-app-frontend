import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import CompositionAPI from '@vue/composition-api';
import SubmitValues from '@/components/pages/donation_form/SubmitValues.vue';
import { NS_BANKDATA, NS_ADDRESS, NS_PAYMENT } from '@/store/namespaces';
import { AddressTypeModel, addressTypeName } from '@/view_models/AddressTypeModel';
import createCookieConsent, { CookieConsentInterface } from '@/cookie_consent';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( CompositionAPI );

const getWrapperWithCookieConsent = ( cookieConsent: CookieConsentInterface ) => {
	return mount( SubmitValues, {
		localVue,
		propsData: {
			trackingData: {
				bannerImpressionCount: 1,
				impressionCount: 5,
			},
		},
		provide: {
			cookieConsent: cookieConsent,
		},
		store: new Vuex.Store( {
			modules: {
				[ NS_ADDRESS ]: {
					namespaced: true,
					state: {
						receiptOptOut: false,
						newsletterOptIn: true,
						addressType: AddressTypeModel.PERSON,
						values: {
							firstName: 'Victor',
							lastName: 'van Doom',
							salutation: 'Herr',
							title: 'Dr.',
							street: 'Untere Straße 5',
							postcode: '08114',
							city: 'Haasenstadt',
							country: 'DE',
							email: 'doom@untergang.biz',
						},
					},

				},
				[ NS_BANKDATA ]: {
					namespaced: true,
					state: {
						values: {
							iban: 'DE12500105170648489890',
							bic: 'INGDDEFFXXX',
						},
					},
				},
				[ NS_PAYMENT ]: {
					namespaced: true,
					state: {
						values: {
							amount: '2349',
							interval: '3',
							type: 'BEZ',
						},
					},
				},
			},
		} ),
	} );
};

describe( 'SubmitValues.vue', () => {
	it( 'renders input fields', () => {
		const cookieConsent = createCookieConsent( 'yes' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders the amount as an integer', () => {
		const cookieConsent = createCookieConsent( 'yes' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );
		expect( ( wrapper.find( 'input[name=amount]' ).element as HTMLInputElement ).value ).toBe( '2349' );
	} );

	it( 'renders the address type as string', () => {
		const cookieConsent = createCookieConsent( 'yes' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );
		expect( ( wrapper.find( 'input[name=addressType]' ).element as HTMLInputElement ).value ).toBe( addressTypeName( AddressTypeModel.PERSON ) );
	} );

	it( 'sends tracking when cookies are consented', () => {
		const cookieConsent = createCookieConsent( 'yes' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		expect( wrapper.find( 'input[name=impCount]' ).exists() ).toBe( true );
		expect( wrapper.find( 'input[name=bImpCount]' ).exists() ).toBe( true );
	} );

	it( 'does not send tracking when cookies are not consented', () => {
		const cookieConsent = createCookieConsent( 'no' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		expect( wrapper.find( 'input[name=impCount]' ).exists() ).toBeFalsy();
		expect( wrapper.find( 'input[name=bImpCount]' ).exists() ).toBeFalsy();
	} );
} );
