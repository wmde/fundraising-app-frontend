// This file encapsulates the tracking interactions with Matomo

declare var _paq: MatomoLoggable; /* eslint-disable-line no-underscore-dangle */

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

export function trackEvent( eventName: string, category: string, action: string ) {
	_paq.push( [ 'trackEvent', eventName, category, action ] );
}

export function trackGoal( goalID: number, amount?: number ) {
	_paq.push( [ 'trackGoal', goalID, amount ] );
}
