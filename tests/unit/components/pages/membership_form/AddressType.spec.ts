import { describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { createStore } from '@src/store/membership_store';
import { Store } from 'vuex';

describe( 'AddressType.vue', () => {
	let store: Store<any>;
	const getWrapper = (
		props: {
			disabledAddressTypes: AddressTypeModel[];
			initialAddressType: AddressTypeModel;
		} = {
			disabledAddressTypes: [],
			initialAddressType: AddressTypeModel.COMPANY,
		} ): VueWrapper<any> => {
		store = createStore();
		return mount( AddressType, {
			props: {
				disabledAddressTypes: [],
				isDirectDebit: false,
				addressTypeIsInvalid: false,
				initialAddressType: AddressTypeModel.COMPANY,
				...props,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'preselects initial address type', () => {
		const wrapper = getWrapper();

		const privatePersonRadioElement = wrapper.find<HTMLInputElement>( '#addressType-0' );
		const companyRadioElement = wrapper.find<HTMLInputElement>( '#addressType-1' );

		expect( companyRadioElement.element.checked ).toBeTruthy();
		expect( privatePersonRadioElement.element.checked ).toBeFalsy();
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

	it( 'shows no tooltip when company is not disabled', () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.tooltip' ).exists() ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( '#addressType-1' ).element.disabled ).toBeFalsy();
	} );

	it( 'disables company and shows tooltip when company is in disabledAddressTypes', () => {
		const wrapper = getWrapper( {
			disabledAddressTypes: [ AddressTypeModel.COMPANY ],
			initialAddressType: AddressTypeModel.PERSON,
		} );

		expect( wrapper.find<HTMLInputElement>( '#addressType-1' ).element.disabled ).toBeTruthy();
		expect( wrapper.find( '.tooltip' ).exists() ).toBeTruthy();
	} );
} );
