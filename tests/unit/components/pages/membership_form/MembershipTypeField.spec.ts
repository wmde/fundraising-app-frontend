import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { setMembershipType } from '@src/store/membership_address/actionTypes';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { Store } from 'vuex';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import { nextTick } from 'vue';

describe( 'MembershipTypeField.vue', () => {
	let store: Store<any>;

	const getWrapper = (): VueWrapper<any> => {
		store = createStore();
		return mount( MembershipTypeField, {
			props: {
				modelValue: MembershipTypeModel.SUSTAINING,
				disabledMembershipTypes: [],
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'emits model change event on field change', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		await wrapper.find<HTMLInputElement>( '#membershipType-1 input' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
	} );

	it( 'disables active membership types if they are in disabledMembershipTypes prop', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1 input' );

		expect( activeMembershipInputElement.attributes().disabled ).toBeUndefined();

		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );

		expect( activeMembershipInputElement.attributes().disabled ).toBeDefined();
	} );

	it( 'displays an error if active membership type is selected and then address type company is selected', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1 input' );

		expect( wrapper.find( '.is-danger' ).exists() ).toBe( false );

		await wrapper.find<HTMLInputElement>( '#membershipType-1 input' ).trigger( 'change' );
		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );

		expect( activeMembershipInputElement.attributes().disabled ).toBeDefined();
		expect( wrapper.find( '.is-danger' ).exists() ).toBe( true );
	} );

	it( 'hides the error when a different membership type is selected', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1 input' );
		const sustainingMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-0 input' );

		await activeMembershipInputElement.trigger( 'change' );
		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );

		expect( wrapper.find( '.is-danger' ).exists() ).toBe( true );

		await sustainingMembershipInputElement.trigger( 'change' );

		expect( activeMembershipInputElement.element.checked ).toBe( false );
		expect( sustainingMembershipInputElement.element.checked ).toBe( true );
		expect( activeMembershipInputElement.attributes().disabled ).toBeDefined();
		expect( wrapper.find( '.is-danger' ).exists() ).toBe( false );
	} );

	it( 'hides the error when the membership option is not part of the disabled options anymore', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1 input' );

		await activeMembershipInputElement.trigger( 'change' );
		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );
		expect( wrapper.find( '.is-danger' ).exists() ).toBe( true );

		await wrapper.setProps( { disabledMembershipTypes: [] } );

		expect( activeMembershipInputElement.element.checked ).toBe( true );
		expect( activeMembershipInputElement.attributes().disabled ).toBeUndefined();
		expect( wrapper.find( '.is-danger' ).exists() ).toBe( false );
	} );
} );
