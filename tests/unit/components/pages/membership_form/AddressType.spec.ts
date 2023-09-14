import { mount } from '@vue/test-utils';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

describe( 'AddressType.vue', () => {

	it( 'emits field changed event on blur', async () => {
		const wrapper = mount( AddressType );
		const event = 'address-type';

		const company = wrapper.find( '#company input' );
		await company.trigger( 'change' );

		const person = wrapper.find( '#personal input' );
		await person.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 2 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.PERSON ] );
	} );
} );
