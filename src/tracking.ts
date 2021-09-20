// This file encapsulates the tracking interactions with Matomo

declare var _paq: MatomoLoggable; /* eslint-disable-line no-underscore-dangle,no-use-before-define */

interface MatomoLoggable {
	push( eventData: Array<any> ): void;
}

export function trackDynamicForm() {
	_paq.push( [ 'FormAnalytics::scanForForms' ] );
}

export function trackFormSubmission( formElement: HTMLFormElement ) {
	_paq.push( [ 'FormAnalytics::trackFormSubmit', formElement ] );
}

export function trackFormFieldRestored( formName: string, formFieldName: string ) {
	_paq.push( [ 'trackEvent', 'Form Field Restored', formName, formFieldName ] );
}

export function trackFormValidationErrors( formName: string, formFieldName: string ) {
	_paq.push( [ 'trackEvent', 'Form Field Invalid', formName, formFieldName ] );
}

export function trackEvent( eventName: string, ...params: Array<string> ) {
	_paq.push( [ 'trackEvent', eventName, ...params ] );
}

export function setTrackingConsentGiven() {
	_paq.push( [ 'setCookieConsentGiven' ] );
}

export function forgetTrackingConsentGiven() {
	_paq.push( [ 'forgetCookieConsentGiven' ] );
}

export function trackGoal( id: number ) {
	_paq.push( [ 'trackGoal', id ] );
}
