import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import axios from 'axios';

import CookieReview from '@/components/cookie_notice/CookieReview.vue';
import createCookieConsent, { CONSENT_STATE, CookieConsentInterface } from '@/cookie_consent';

jest.mock( 'axios', () => ( {
	post: jest.fn( () => Promise.resolve( { 'status': 'OK' } ) ),
} ) );

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( CompositionAPI );

const getWrapperWithCookieConsent = ( cookieConsent: CookieConsentInterface ) => {
	return mount( CookieReview, {
		localVue,
		mocks: {
			$t: ( key: string ) => key,
		},
		provide: {
			cookieConsent,
		},
	} );
};

describe( 'CookieReview', () => {
	beforeEach( () => {
		jest.resetModules();
		jest.clearAllMocks();
	} );

	it( 'Sets optional checkbox checked if initialised with consent given', async () => {
		const cookieConsent = createCookieConsent( 'yes' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		expect( ( <HTMLInputElement>wrapper.find( 'input[name=optional]' ).element ).checked ).toBeTruthy();
	} );

	it( 'Sets optional checkbox unchecked if initialised with consent not given', async () => {
		const cookieConsent = createCookieConsent( 'no' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		expect( ( <HTMLInputElement>wrapper.find( 'input[name=optional]' ).element ).checked ).toBeFalsy();
	} );

	it( 'Sets optional checkbox unchecked if initialised with consent unset', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		expect( ( <HTMLInputElement>wrapper.find( 'input[name=optional]' ).element ).checked ).toBeFalsy();
	} );

	it( 'submits consent when accept button is clicked', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		wrapper.find( '.accept > button' ).trigger( 'click' );
		await wrapper.vm.$nextTick();

		expect( cookieConsent.consentState.value ).toEqual( CONSENT_STATE.TRUE );
	} );

	// See https://phabricator.wikimedia.org/T281373
	xit( 'submits positive consent when save button is clicked and consent given', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		await wrapper.find( 'input[name=optional]' ).trigger( 'change' );
		await wrapper.find( '.save > button' ).trigger( 'click' );

		expect( cookieConsent.consentState.value ).toEqual( CONSENT_STATE.TRUE );
	} );

	it( 'submits negative consent when save button is clicked and consent not given', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		const wrapper = getWrapperWithCookieConsent( cookieConsent );

		wrapper.find( '.save > button' ).trigger( 'click' );
		await wrapper.vm.$nextTick();

		expect( cookieConsent.consentState.value ).toEqual( CONSENT_STATE.FALSE );
	} );
} );
