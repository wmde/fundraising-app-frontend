import { mount, VueWrapper } from '@vue/test-utils';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { createStore } from '@src/store/membership_store';
import { Store } from 'vuex';

describe( 'AddressType.vue', () => {
	let store: Store<any>;
	const getWrapper = (): VueWrapper<any> => {
		store = createStore();
		return mount( AddressType, {
			props: {
				disabledAddressTypes: [],
				isDirectDebit: false,
				addressTypeIsInvalid: false,
				initialAddressType: AddressTypeModel.COMPANY,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'preselects initial address type', () => {
		const wrapper = getWrapper();

		const privatePersonRadioElement = wrapper.find( '.radio-form-input:first-child' );
		const companyRadioElement = wrapper.find( '.radio-form-input:last-child' );

		expect( companyRadioElement.classes() ).toContain( 'is-active' );
		expect( privatePersonRadioElement.classes() ).not.toContain( 'is-active' );
	} );

	it( 'emits field changed event on blur', async () => {
		const wrapper = getWrapper();
		const event = 'field-changed';
		const privatePersonRadioElement = wrapper.find<HTMLInputElement>( '#addressType-0' );

		await privatePersonRadioElement.trigger( 'change' );
		await privatePersonRadioElement.trigger( 'blur' );

		expect( wrapper.emitted( event ) ).toHaveLength( 1 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.PERSON ] );
	} );
} );
