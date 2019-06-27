import DonationSummary from '@/components/DonationSummary.vue';
import { mount } from '@vue/test-utils';

describe( 'DonationForm', () => {
	const payment = {
		paymentType: 'BEZ',
		interval: 12,
		amount: 14.99,
	};

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
			propsData: {
				address,
				payment,
				addressType: 'person',
			},
			mocks: { $t },
		} );
		expect( $t ).toBeCalledWith( 'donation_confirmation_topbox_donor_type_person' );
		const params = findTranslationCallParams( 'donation_confirmation_topbox_summary', $t.mock.calls );
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
			propsData: {
				address,
				payment,
				addressType: 'firma',
			},
			mocks: { $t },
		} );
		expect( $t ).toBeCalledWith( 'donation_confirmation_topbox_donor_type_company' );
		const params = findTranslationCallParams( 'donation_confirmation_topbox_summary', $t.mock.calls );
		const expectedFields = [ 'fullName', 'streetAddress', 'postalCode', 'city' ];
		expectedFields.map( ( fieldName: string ) => expect( params.address ).toContain( address[ fieldName ] ) );
	} );

	it( 'translates payment information', () => {
		const $t = jest.fn( x => x );
		mount( DonationSummary, {
			propsData: {
				payment,
				address: {},
				addressType: 'person',
			},
			mocks: { $t },
		} );
		expect( $t ).toBeCalledWith( 'BEZ' );
		expect( $t ).toBeCalledWith( 'donation_form_payment_interval_12' );
		const params = findTranslationCallParams( 'donation_confirmation_topbox_summary', $t.mock.calls );
		expect( params.formattedAmount ).toBe( '14,99' );
		expect( params.interval ).toBe( 'donation_form_payment_interval_12' );
		expect( params.paymentType ).toBe( 'BEZ' );
	} );

} );
