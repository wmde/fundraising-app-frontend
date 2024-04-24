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

		const person = wrapper.find( `#addressType-${AddressTypeModel.PERSON.valueOf()}` );
		await person.trigger( 'change' );

		const company = wrapper.find( `#addressType-${AddressTypeModel.COMPANY.valueOf()}` );
		await company.trigger( 'change' );

		const anon = wrapper.find( `#addressType-${AddressTypeModel.ANON.valueOf()}` );
		await anon.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 3 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.PERSON ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
		expect( wrapper.emitted( event )![ 2 ] ).toEqual( [ AddressTypeModel.ANON ] );
	} );

	it( 'disables anonymous address type if supplied via disabledAddressTypes property', async () => {
		// TODO test with person instead of company and expect it to *not* be disabled, because person is the fallback type
		const wrapper = getWrapper( [ AddressTypeModel.ANON, AddressTypeModel.COMPANY ], true );
		const person = wrapper.find( `#addressType-${AddressTypeModel.PERSON.valueOf()}` );
		const company = wrapper.find( `#addressType-${AddressTypeModel.COMPANY.valueOf()}` );
		const anonymous = wrapper.find<HTMLInputElement>( `#addressType-${AddressTypeModel.ANON.valueOf()}` );

		expect( person.attributes( 'disabled' ) ).toBeUndefined();
		expect( company.attributes( 'disabled' ) ).toBeDefined();
		expect( anonymous.attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'renders hint if payment is direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], true );

		expect( wrapper.find( '.form-field-intro' ).isVisible() ).toBe( true );
	} );

	it( 'does not render hint if payment is not direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], false );

		expect( wrapper.find( '.form-field-intro' ).isVisible() ).toBe( false );
	} );
} );
