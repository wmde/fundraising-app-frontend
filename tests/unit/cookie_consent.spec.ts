import axios from 'axios';
import createCookieConsent, { CONSENT_STATE } from '@/cookie_consent';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';

jest.mock( 'axios', () => ( {
	post: jest.fn( () => Promise.resolve( { 'status': 'OK' } ) ),
} ) );

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( CompositionAPI );

describe( 'cookie_consent', () => {
	beforeEach( () => {
		jest.resetModules();
		jest.clearAllMocks();
	} );

	it( 'Initialises correct state on creation', () => {
		const cookieConsentUnset = createCookieConsent( 'unset' );
		const cookieConsentYes = createCookieConsent( 'yes' );
		const cookieConsentNo = createCookieConsent( 'no' );

		expect( cookieConsentUnset.consentState.value ).toBe( CONSENT_STATE.UNSET );
		expect( cookieConsentYes.consentState.value ).toBe( CONSENT_STATE.TRUE );
		expect( cookieConsentNo.consentState.value ).toBe( CONSENT_STATE.FALSE );
	} );

	it( 'Throws an exception when passed an invalid state string on creation', () => {
		expect( () => {
			createCookieConsent( 'I am not a real state' );
		} ).toThrow( 'Argument out of range exception' );
	} );

	it( 'Tracks if consent is submitted', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		expect( cookieConsent.consentIsSubmitted.value ).toBeFalsy();

		await cookieConsent.submitConsent( CONSENT_STATE.TRUE );
		expect( cookieConsent.consentIsSubmitted.value ).toBeTruthy();

		await cookieConsent.submitConsent( CONSENT_STATE.FALSE );
		expect( cookieConsent.consentIsSubmitted.value ).toBeTruthy();
	} );

	it( 'Tracks if consent is given', async () => {
		const cookieConsent = createCookieConsent( 'unset' );
		expect( cookieConsent.consentIsGiven.value ).toBeFalsy();

		await cookieConsent.submitConsent( CONSENT_STATE.FALSE );
		expect( cookieConsent.consentIsGiven.value ).toBeFalsy();

		await cookieConsent.submitConsent( CONSENT_STATE.TRUE );
		expect( cookieConsent.consentIsGiven.value ).toBeTruthy();
	} );

	it( 'Posts consent request when consent is submitted', async () => {
		const cookieConsent = createCookieConsent( 'unset' );

		const expectedPayload = new FormData();
		expectedPayload.append( 'cookie_consent', 'yes' );

		await cookieConsent.submitConsent( CONSENT_STATE.TRUE );

		expect( axios.post ).toHaveBeenCalledTimes( 1 );
		expect( axios.post ).toHaveBeenCalledWith(
			'/set-cookie-preferences',
			expectedPayload,
			{ headers: { 'Content-Type': 'multipart/form-data' } }
		);
	} );

	it( 'Throws an exception when passed an invalid state when consent is submitted', () => {
		const cookieConsent = createCookieConsent( 'unset' );

		expect( cookieConsent.submitConsent( Symbol.for( 'I am not a real state' ) ) )
			.rejects.toEqual( 'Argument out of range exception' );
	} );
} );
