import { createI18n } from 'vue-i18n';
import Cookies from 'js-cookie';

export const COOKIE_NAME = 'locale';
export const DEFAULT_LOCALE = 'de_DE';

export function createLocalisation( messages: { [ key: string ]: string; } ) {
	type MessageSchema = typeof messages;
	const locale = ( Cookies.get( COOKIE_NAME ) ?? DEFAULT_LOCALE ).replace( '_', '-' );
	type LocaleType = typeof locale;
	return createI18n<[MessageSchema], LocaleType>( {
		locale: locale,
		warnHtmlInMessage: 'off',
		legacy: false,
		messages: {
			[ locale ]: messages,
		},
		numberFormats: {
			'de-DE': {
				currency: {
					style: 'currency',
					currency: 'EUR',
					notation: 'standard',
					currencyDisplay: 'symbol',
				},
				euros: {
					style: 'currency',
					currency: 'EUR',
					notation: 'standard',
					currencyDisplay: 'symbol',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				},
				decimal: {
					style: 'decimal',
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				},
				percent: {
					style: 'percent',
					useGrouping: false,
				},
			},
			'en-GB': {
				currency: {
					style: 'currency',
					currency: 'EUR',
					notation: 'standard',
					currencyDisplay: 'symbol',
				},
				euros: {
					style: 'currency',
					currency: 'EUR',
					notation: 'standard',
					currencyDisplay: 'symbol',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				},
				decimal: {
					style: 'decimal',
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				},
				percent: {
					style: 'percent',
					useGrouping: false,
				},
			},
		},
	} );
}
