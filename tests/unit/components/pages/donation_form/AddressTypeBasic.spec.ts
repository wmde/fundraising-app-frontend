import { mount, VueWrapper } from '@vue/test-utils';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

describe( 'AddressTypeBasic.vue', () => {

	const getWrapper = ( disabledAddressTypes: AddressTypeModel[], isDirectDebit: boolean ): VueWrapper<any> => {
		return mount( AddressTypeBasic, {
			props: {
				disabledAddressTypes,
				isDirectDebit,
				addressTypeIsInvalid: false,
			},
		} );
	};

	it( 'emits field changed events', async () => {
		const wrapper = getWrapper( [], false );
		const event = 'address-type';

		const person = wrapper.find( `#addressType-0` );
		await person.trigger( 'change' );

		const company = wrapper.find( `#addressType-1` );
		await company.trigger( 'change' );

		const anon = wrapper.find( `#addressType-2` );
		await anon.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 3 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.PERSON ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
		expect( wrapper.emitted( event )![ 2 ] ).toEqual( [ AddressTypeModel.ANON ] );
	} );

	it( 'disables anonymous address type if supplied via disabledAddressTypes property', async () => {
		// TODO test with person instead of company and expect it to *not* be disabled, because person is the fallback type
		const wrapper = getWrapper( [ AddressTypeModel.ANON, AddressTypeModel.COMPANY ], true );
		const person = wrapper.find( `#addressType-0` );
		const company = wrapper.find( `#addressType-1` );
		const anonymous = wrapper.find<HTMLInputElement>( `#addressType-2` );

		expect( person.attributes( 'disabled' ) ).toBeUndefined();
		expect( company.attributes( 'disabled' ) ).toBeDefined();
		expect( anonymous.attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'renders tooltip hint if payment is direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], true );

		expect( wrapper.find( '.radio-field-tooltip' ).isVisible() ).toBe( true );
	} );

	it( 'does not render tooltip hint if payment is not direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], false );

		expect( wrapper.find( '.radio-field-tooltip' ).exists() ).toBe( false );
	} );
} );
