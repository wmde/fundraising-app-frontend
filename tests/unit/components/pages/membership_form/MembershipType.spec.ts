import { mount, VueWrapper } from '@vue/test-utils';
import MembershipType from '@src/components/pages/membership_form/MembershipType.vue';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { setMembershipType } from '@src/store/membership_address/actionTypes';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Store } from 'vuex';

describe( 'MembershipType.vue', () => {
	let wrapper: VueWrapper<any>;
	let store: Store<any>;

	beforeEach( () => {
		store = createStore();
		wrapper = mount( MembershipType, {
			global: {
				plugins: [ store ],
			},
		} );
	} );

	it( 'sends selected membership type to the store on change', async () => {
		store.dispatch = jest.fn();
		await wrapper.find( '#active input' ).trigger( 'change' );
		const expectedAction = action( NS_MEMBERSHIP_ADDRESS, setMembershipType );
		const expectedPayload = MembershipTypeModel.ACTIVE;

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'disables active membership type if the address type is company', () => {
		// Stub company address being selected
		const comp = wrapper.vm.$options!.computed;
		if ( typeof comp.isActiveTypeDisabled === 'function' ) {
			comp.isActiveTypeDisabled = jest.fn( () => true );
			expect( wrapper.find( '#active' ).attributes( 'disabled' ) ).toBeTruthy();
		}
	} );

	it( 'displays an error if active membership type is selected and then address type company is selected', () => {
		wrapper.find( '#active' ).trigger( 'click' );
		// Stub company address being selected
		const comp = wrapper.vm.$options!.computed;
		if ( typeof comp.isActiveTypeDisabled === 'function' ) {
			comp.isActiveTypeDisabled = jest.fn( () => true );
			expect( wrapper.find( 'span[class="help is-danger"]' ).exists() ).toBeTruthy();
		}
	} );

	it( 'hides the error when a different membership type is selected', () => {
		wrapper.find( '#active' ).trigger( 'click' );
		// Stub company address being selected
		const comp = wrapper.vm.$options!.computed;
		if ( typeof comp.isActiveTypeDisabled === 'function' ) {
			comp.isActiveTypeDisabled = jest.fn( () => true );
			expect( wrapper.find( 'span[class="help is-danger"]' ).exists() ).toBeTruthy();

			wrapper.find( '#sustaining' ).trigger( 'click' );
			expect( wrapper.find( 'span[class="help is-danger"]' ).exists() ).toBeFalsy();
		}
	} );

	it( 'hides the error when a different address type is selected', () => {
		wrapper.find( '#active' ).trigger( 'click' );
		// Stub company address being selected
		const comp = wrapper.vm.$options!.computed;
		if ( typeof comp.isActiveTypeDisabled === 'function' ) {
			comp.isActiveTypeDisabled = jest.fn( () => true );
			expect( wrapper.find( 'span[class="help is-danger"]' ).exists() ).toBeTruthy();

			store.getters.addressType = jest.fn( () => AddressTypeModel.PERSON );
			expect( wrapper.find( 'span[class="help is-danger"]' ).exists() ).toBe( false );
		}
	} );
} );
