import DonationSummary from '@/components/shared/DonationSummary.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import { FeatureTogglePlugin } from '@/FeatureToggle';

const localVue = createLocalVue();
localVue.use( FeatureTogglePlugin );

describe( 'DonationSummary', () => {
	const payment = {
		paymentType: 'BEZ',
		interval: 12,
		amount: 14.99,
	};
	const countries = [
		{
			'countryCode': 'DE',
			'countryFullName': 'Deutschland',
			'isFrequentCountry': true,
			'postCodeValidation': '^[0-9]{5}$',
		},
		{
			'countryCode': 'AT',
			'countryFullName': 'Österreich',
			'isFrequentCountry': true,
			'postCodeValidation': '^[0-9]{4}$',
		},
	];
	const salutations = [
		{
			'label': 'Herr',
			'value': 'Herr',
			'display': 'Herr',
		},
		{
			'label': 'Frau',
			'value': 'Frau',
			'display': 'Frau',
		},
	];

	const findTranslationCallParams = ( messageKey: string, calls: any[] ) => calls.find( call => call[ 0 ] === messageKey )[ 1 ];

	it( 'renders private addresses', () => {
		const $t = jest.fn();
		const address:{ [index:string] : string } = {
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
			localVue,
			propsData: {
				address,
				payment,
				addressType: 'person',
				countries,
				salutations,
				languageItem: 'language_item',
			},
			mocks: {
				$t,
				$n: () => {},
			},
		} );
		expect( $t ).toBeCalledWith( 'donation_confirmation_topbox_donor_type_person' );
		const params = findTranslationCallParams( 'language_item', $t.mock.calls );
		const expectedFields = [ 'salutation', 'fullName', 'streetAddress', 'postalCode', 'city' ];
		expectedFields.map( ( fieldName: string ) => expect( params.address ).toContain( address[ fieldName ] ) );
	} );

	it( 'renders company addresses', () => {
		const $t = jest.fn();
		const address:{ [index:string] : string } = {
			fullName: 'Evil Corp',
			streetAddress: 'Blutgasse 5',
			postalCode: '80666',
			city: 'München',
			countryCode: 'DE',
		};
		mount( DonationSummary, {
			localVue,
			propsData: {
				address,
				payment,
				addressType: 'firma',
				countries,
				salutations,
				languageItem: 'language_item',
			},
			mocks: {
				$t,
				$n: () => {},
			},
		} );
		expect( $t ).toBeCalledWith( 'donation_confirmation_topbox_donor_type_company' );
		const params = findTranslationCallParams( 'language_item', $t.mock.calls );
		const expectedFields = [ 'fullName', 'streetAddress', 'postalCode', 'city' ];
		expectedFields.map( ( fieldName: string ) => expect( params.address ).toContain( address[ fieldName ] ) );
	} );

	it( 'translates payment information', () => {
		const $t = jest.fn( x => x );
		const $n = jest.fn( x => x );
		mount( DonationSummary, {
			localVue,
			propsData: {
				payment,
				address: {},
				addressType: 'person',
				countries,
				salutations,
				languageItem: 'language_item',
			},
			mocks: {
				$t,
				$n,
			},
		} );
		expect( $t ).toBeCalledWith( 'BEZ' );
		expect( $t ).toBeCalledWith( 'donation_form_payment_interval_12' );
		expect( $n ).toBeCalledWith( 14.99, expect.anything() );
		const params = findTranslationCallParams( 'language_item', $t.mock.calls );
		expect( params.interval ).toBe( 'donation_form_payment_interval_12' );
		expect( params.paymentType ).toBe( 'BEZ' );
	} );

} );
