import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import axios from 'axios';

import CookieNotice from '@/components/cookie_notice/CookieNotice.vue';
import createCookieConsent, { CONSENT_STATE, CookieConsentInterface } from '@/cookie_consent';

jest.mock( 'axios', () => ( {
	post: jest.fn( () => Promise.resolve( { 'status': 'OK' } ) ),
} ) );

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( CompositionAPI );

const getWrapperWithCookieConsent = ( cookieConsent: CookieConsentInterface ) => {
	return mount( CookieNotice, {
		localVue,
		mocks: {
			$t: ( key: string ) => key,
		},
		provide: {
			cookieConsent,
		},
	} );
};

describe( 'CookieNotice', () => {
	beforeEach( () => {
		jest.resetModules();
		jest.clearAllMocks();
	} );

	it( 'shows when no consent choice has been submitted', async () => {
		const wrapper = getWrapperWithCookieConsent( createCookieConsent( 'unset' ) );

		expect( wrapper.find( '.cookie-notice' ).exists() ).toBe( true );
	} );

	it( 'does not show when consent choice has been submitted', async () => {
		let yesWrapper = getWrapperWithCookieConsent( createCookieConsent( 'yes' ) );
		let noWrapper = getWrapperWithCookieConsent( createCookieConsent( 'no' ) );

		expect( yesWrapper.find( '.cookie-notice' ).exists() ).toBe( false );
		expect( noWrapper.find( '.cookie-notice' ).exists() ).toBe( false );
	} );

	it( 'submits consent when accept button is clicked', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		wrapper.find( '.accept > button' ).trigger( 'click' );
		await wrapper.vm.$nextTick();

		expect( cookieConsent.consentState.value ).toEqual( CONSENT_STATE.TRUE );
	} );

	it( 'submits consent when necessary button is clicked', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		wrapper.find( '.necessary > button' ).trigger( 'click' );
		await wrapper.vm.$nextTick();

		expect( cookieConsent.consentState.value ).toEqual( CONSENT_STATE.FALSE );
	} );
} );
