import DonationSummary from '@src/components/shared/DonationSummary.vue';
import { config, mount } from '@vue/test-utils';
import { Salutation } from '@src/view_models/Salutation';
import { createI18n } from 'vue-i18n';

const i18n = createI18n( {
	locale: 'en-US',
	fallbackLocale: 'en-US',
	legacy: false,
	messages: {
		'en-US': {
			'BEZ': 'BEZ',
			'donation_form_payment_interval_12': 'donation_form_payment_interval_12',
			'donation_confirmation_topbox_donor_type_person': 'Person',
			'donation_confirmation_review_email_missing': 'Email',
			'language_item': '{interval} {formattedAmount} {paymentType} {personType} {address} {email}',
		},
	},
	numberFormats: {
		'en-US': {
			currency: {
				style: 'currency',
				currency: 'EUR',
				notation: 'standard',
				currencyDisplay: 'symbol',
			},
		},
	},
} );

config.global.plugins = [ i18n ];
config.global.mocks = {
	t: jest.fn(),
	n: jest.fn(),
};

describe( 'DonationSummary.vue', () => {
	const payment = {
		paymentType: 'BEZ',
		interval: 12,
		amount: 14.99,
	};
	const countries = [
		{
			'countryCode': 'DE',
			'countryFullName': 'Deutschland',
			'group': '',
			'postCodeValidation': '^[0-9]{5}$',
		},
		{
			'countryCode': 'AT',
			'countryFullName': 'Österreich',
			'group': '',
			'postCodeValidation': '^[0-9]{4}$',
		},
	];
	const salutations: Salutation[] = [
		{
			label: 'Herr',
			value: 'Herr',
			display: 'Herr',
			greetings: {
				formal: 'Herr',
				informal: 'Herr',
				lastNameInformal: 'Herr',
			},
		},
		{
			label: 'Frau',
			value: 'Frau',
			display: 'Frau',
			greetings: {
				formal: 'Frau',
				informal: 'Frau',
				lastNameInformal: 'Frau',
			},
		},
	];

	const findTranslationCallParams = ( messageKey: string, calls: any[] ) => calls.find( call => call[ 0 ] === messageKey )[ 1 ];

	it( 'renders private addresses', () => {
		const $t = jest.fn();
		const address: { [ index: string ]: string } = {
			salutation: 'Herr',
			title: 'Dr.',
			firstName: 'Vlad',
			lastName: 'Dracul',
			fullName: 'Dr. Vlad Dracul',
			streetAddress: 'Blutgasse 5',
			postalCode: '80666',
			city: 'München',
			countryCode: 'DE',
		};
		mount( DonationSummary, {
			props: {
				address,
				payment,
				addressType: 'person',
				countries,
				salutations,
				languageItem: 'language_item',
			},
			global: {
				mocks: {
					$t,
					$n: () => {
					},
				},
			},
		} );
		expect( $t ).toBeCalledWith( 'donation_confirmation_topbox_donor_type_person' );
		const params = findTranslationCallParams( 'language_item', $t.mock.calls );
		const expectedFields = [ 'salutation', 'fullName', 'streetAddress', 'postalCode', 'city' ];
		expectedFields.map( ( fieldName: string ) => expect( params.address ).toContain( address[ fieldName ] ) );
	} );

	it( 'renders company addresses', () => {
		const $t = jest.fn();
		const address: { [ index: string ]: string } = {
			fullName: 'Evil Corp',
			streetAddress: 'Blutgasse 5',
			postalCode: '80666',
			city: 'München',
			countryCode: 'DE',
		};
		mount( DonationSummary, {
			props: {
				address,
				payment,
				addressType: 'firma',
				countries,
				salutations,
				languageItem: 'language_item',
			},
			global: {
				mocks: {
					$t,
					$n: () => {
					},
				},
			},
		} );
		expect( $t ).toBeCalledWith( 'donation_confirmation_topbox_donor_type_company' );
		const params = findTranslationCallParams( 'language_item', $t.mock.calls );
		const expectedFields = [ 'fullName', 'streetAddress', 'postalCode', 'city' ];
		expectedFields.map( ( fieldName: string ) => expect( params.address ).toContain( address[ fieldName ] ) );
	} );

	function getLanguageItemMock(): ( key: string, values?: Record<string, string> ) => string {
		return ( key: string, values: Record<string, string> = {} ) => {
			if ( key !== 'language_item' ) {
				return key;
			}
			let translated = '{interval} {formattedAmount} {paymentType} {personType} {address} {email}';
			for ( const [ recordKey, value ] of Object.entries( values ) ) {
				translated = translated.replace( `{${ recordKey }}`, `${ recordKey }:${ value }` );
			}
			return translated;
		};
	}

	it( 'translates payment information', () => {
		const $t = getLanguageItemMock();
		const $n = jest.fn( x => x );

		const wrapper = mount( DonationSummary, {
			props: {
				payment,
				address: {},
				addressType: 'person',
				countries,
				salutations,
				languageItem: 'language_item',
			},
			global: {
				mocks: {
					$t,
					$n,
				},
			},
		} );

		expect( wrapper.find( '.payment-summary' ).text() ).toStrictEqual( [
			'interval:donation_form_payment_interval_12',
			'formattedAmount:14.99 euros',
			'paymentType:BEZ',
			'personType:donation_confirmation_topbox_donor_type_person',
			'address:donation_confirmation_review_address_missing',
			'email:donation_confirmation_review_email_missing',
		].join( ' ' ) );
	} );

} );
