import { Ref, ComputedRef, computed, ref } from '@vue/composition-api';
import axios from 'axios';
import { forgetTrackingConsentGiven, setTrackingConsentGiven } from '@/tracking';

const CONSENT_ENDPOINT: string = '/set-cookie-preferences';

export const CONSENT_STATE = Object.freeze( {
	UNSET: Symbol.for( 'unset' ),
	TRUE: Symbol.for( 'yes' ),
	FALSE: Symbol.for( 'no' ),
} );

export function consentStringToState( consent: string ) {
	switch ( consent ) {
		case 'unset':
			return CONSENT_STATE.UNSET;
		case 'yes':
			return CONSENT_STATE.TRUE;
		case 'no':
			return CONSENT_STATE.FALSE;
		default:
			throw new Error( 'Argument out of range exception' );
	}
}

let consentState: Ref<symbol>;
let consentIsSubmitted: ComputedRef<boolean>;
let consentIsGiven: ComputedRef<boolean>;

export interface CookieConsentInterface {
	consentState: { value: symbol };
	consentIsGiven: { value: boolean };
	consentIsSubmitted: { value: boolean };
	submitConsent( consent: symbol ): Promise<void>;
}

/**
 * Dummy object to use as default value for `inject`, to avoid TS null/undefined warnings
 */
export const NullCookieConsent = {
	consentState: { value: CONSENT_STATE.UNSET },
	consentIsGiven: { value: false },
	consentIsSubmitted: { value: false },
	submitConsent: () => Promise.resolve(),
};

export default function createCookieConsent( defaultConsent: string ): CookieConsentInterface {

	consentState = ref<symbol>( consentStringToState( defaultConsent ) );
	consentIsSubmitted = computed( () => consentState.value !== CONSENT_STATE.UNSET );
	consentIsGiven = computed( () => consentState.value === CONSENT_STATE.TRUE );

	const isValidConsentState = ( consent: symbol ): boolean => {
		switch ( consent ) {
			case CONSENT_STATE.UNSET:
			case CONSENT_STATE.TRUE:
			case CONSENT_STATE.FALSE:
				return true;
			default:
				return false;
		}
	};

	const submitConsent = async ( consent: symbol ): Promise<void> => {
		const form = new FormData();
		const consentString = Symbol.keyFor( consent );
		// This is so extra tracking parameters from the banners are stored if consent is given
		const extraTrackingParameters = window.location.search;

		if ( !isValidConsentState( consent ) || consentString === undefined ) {
			return Promise.reject( 'Argument out of range exception' );
		}

		form.append( 'cookie_consent', consentString );
		return axios.post(
			CONSENT_ENDPOINT + extraTrackingParameters,
			form,
			{ headers: { 'Content-Type': 'multipart/form-data' } }
		).then( () => {
			consentState.value = consent;
			if ( consent === CONSENT_STATE.TRUE ) {
				setTrackingConsentGiven();
			} else {
				forgetTrackingConsentGiven();
			}
		} );
	};

	if ( consentIsGiven.value ) {
		setTrackingConsentGiven();
	}

	return {
		consentState,
		consentIsGiven,
		consentIsSubmitted,
		submitConsent,
	} as CookieConsentInterface;
}
