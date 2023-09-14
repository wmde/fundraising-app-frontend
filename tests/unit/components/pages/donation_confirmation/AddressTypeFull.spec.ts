import { mount } from '@vue/test-utils';
import AddressTypeFull from '@src/components/pages/donation_confirmation/AddressTypeFull.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

describe( 'AddressTypeFull.vue', () => {
	it( 'selected initial address type when given one', async () => {
		const wrapper = mount( AddressTypeFull, {
			props: {
				initialAddressType: 'person',
			},
		} );

		expect( ( <HTMLInputElement>wrapper.find( 'input[value=person]' ).element ).checked ).toBeTruthy();
	} );

	it( 'emits field changed event when changed', async () => {
		const wrapper = mount( AddressTypeFull, {
				props: {
					initialAddressType: '',
				},
			} ),
			event = 'address-type';

		await wrapper.find( 'input[value=person]' ).trigger( 'change' );
		await wrapper.find( 'input[value=company]' ).trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 2 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.PERSON ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
	} );
} );
