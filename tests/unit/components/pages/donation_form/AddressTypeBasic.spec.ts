import { mount, VueWrapper } from '@vue/test-utils';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

describe( 'AddressTypeBasic.vue', () => {

	const getWrapper = ( disabledAddressTypes: AddressTypeModel[], isDirectDebit: boolean ): VueWrapper<any> => {
		return mount( AddressTypeBasic, {
			props: {
				disabledAddressTypes,
				isDirectDebit,
			},
		} );
	};

	it( 'emits field changed events', async () => {
		const wrapper = getWrapper( [], false );
		const event = 'address-type';

		const person = wrapper.find( 'input[value=person]' );
		await person.trigger( 'change' );

		const company = wrapper.find( 'input[value=company]' );
		await company.trigger( 'change' );

		const anon = wrapper.find( 'input[value=anonymous]' );
		await anon.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 3 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.PERSON ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
		expect( wrapper.emitted( event )![ 2 ] ).toEqual( [ AddressTypeModel.ANON ] );
	} );

	it( 'disables anonymous address type if supplied via disabledAddressTypes property', async () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON, AddressTypeModel.PERSON ], true );
		const person = wrapper.find( 'input[value=person]' );
		const company = wrapper.find( 'input[value=company]' );
		const anonymous = wrapper.find( 'input[value=anonymous]' );

		expect( person.attributes( 'disabled' ) ).toBeUndefined();
		expect( company.attributes( 'disabled' ) ).toBeUndefined();
		expect( anonymous.attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'renders hint only if payment is direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], true );

		expect( wrapper.find( '.info-message' ).isVisible() ).toBe( true );
	} );

	it( 'does not render hint if payment is not direct debit', () => {
		const wrapper = getWrapper( [ AddressTypeModel.ANON ], false );

		expect( wrapper.find( '.info-message' ).isVisible() ).toBe( false );
	} );
} );
