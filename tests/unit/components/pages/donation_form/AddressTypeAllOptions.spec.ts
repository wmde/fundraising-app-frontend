import { mount, VueWrapper } from '@vue/test-utils';
import AddressType from '@src/components/pages/donation_form/AddressTypeAllOptions.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

describe( 'AddressTypeAllOptions.vue', () => {

	const getWrapper = ( disabledAddressTypes: AddressTypeModel[], isDirectDebit: boolean = false ): VueWrapper<any> => {
		return mount( AddressType, {
			props: {
				disabledAddressTypes,
				isDirectDebit,
			},
		} );
	};

	it( 'emits field changed event when selecting email or anonymous', async () => {
		const wrapper = getWrapper( [] );
		const event = 'address-type';

		const email = wrapper.find( 'input[value=email]' );
		await email.trigger( 'change' );

		const anon = wrapper.find( 'input[value=anonymous]' );
		await anon.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 2 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.EMAIL ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.ANON ] );
	} );

	it( 'emits field changed event when selecting private or company in a two-step process', async () => {
		const wrapper = getWrapper( [] );
		const event = 'address-type';

		const fullAddress = wrapper.find( 'input[value=full]' );
		await fullAddress.trigger( 'change' );

		const person = wrapper.find( 'input[value=person]' );
		await person.trigger( 'change' );

		const company = wrapper.find( 'input[value=company]' );
		await company.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 3 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.UNSET ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.PERSON ] );
		expect( wrapper.emitted( event )![ 2 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
	} );

	it( 'disables address type if supplied via disabledAddressTypes property', async () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ] );

		const anon = wrapper.find( 'input[value=anonymous]' );
		const email = wrapper.find( 'input[value=email]' );

		expect( anon.attributes( 'disabled' ) ).toBeDefined();
		expect( email.attributes( 'disabled' ) ).toBeUndefined();
	} );

	it( 'renders hint only if payment is direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], true );

		expect( wrapper.find( '.info-message' ).isVisible() ).toBe( true );
	} );

	it( 'does not render hint if payment is not direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ] );

		expect( wrapper.find( '.info-message' ).isVisible() ).toBe( false );
	} );
} );
