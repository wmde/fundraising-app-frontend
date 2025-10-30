import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/membership_store';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { Store } from 'vuex';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';

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

		await wrapper.find<HTMLInputElement>( '#membershipType-1' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
	} );

	it( 'disables active membership types if they are in disabledMembershipTypes prop', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1' );

		expect( activeMembershipInputElement.attributes().disabled ).toBeUndefined();

		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );

		expect( activeMembershipInputElement.attributes().disabled ).toBeDefined();
	} );

	it( 'displays an error if active membership type is selected and then address type company is selected', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1' );

		expect( wrapper.attributes( 'data-error' ) ).toBeFalsy();

		await wrapper.find<HTMLInputElement>( '#membershipType-1' ).trigger( 'change' );
		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );

		expect( activeMembershipInputElement.attributes().disabled ).toBeDefined();
		expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();
	} );

	it( 'hides the error when a different membership type is selected', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1' );
		const sustainingMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-0' );

		await activeMembershipInputElement.trigger( 'change' );
		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );

		expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();

		await sustainingMembershipInputElement.trigger( 'change' );

		expect( activeMembershipInputElement.element.checked ).toBe( false );
		expect( sustainingMembershipInputElement.element.checked ).toBe( true );
		expect( activeMembershipInputElement.attributes().disabled ).toBeDefined();
		expect( wrapper.attributes( 'data-error' ) ).toBeFalsy();
	} );

	it( 'hides the error when the membership option is not part of the disabled options anymore', async () => {
		const wrapper = getWrapper();
		const activeMembershipInputElement = wrapper.find<HTMLInputElement>( '#membershipType-1' );

		await activeMembershipInputElement.trigger( 'change' );
		await wrapper.setProps( { disabledMembershipTypes: [ MembershipTypeModel.ACTIVE ] } );
		expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();

		await wrapper.setProps( { disabledMembershipTypes: [] } );

		expect( activeMembershipInputElement.element.checked ).toBe( true );
		expect( activeMembershipInputElement.attributes().disabled ).toBeUndefined();
		expect( wrapper.attributes( 'data-error' ) ).toBeFalsy();
	} );
} );
