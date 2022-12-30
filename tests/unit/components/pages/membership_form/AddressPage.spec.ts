import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import AddressPage from '@/components/pages/membership_form/subpages/AddressPage.vue';
import AddressType from '@/components/pages/membership_form/AddressType.vue';
import MembershipType from '@/components/pages/membership_form/MembershipType.vue';
import { createStore } from '@/store/membership_store';
import { action } from '@/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@/store/namespaces';
import { setAddressType } from '@/store/membership_address/actionTypes';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import {Salutation} from "../../../../../src/view_models/Salutation";
import {AddressValidation} from "../../../../../src/view_models/Validation";

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );

describe( 'AddressPage.vue', () => {
	let wrapper: any;
	beforeEach( () => {
		wrapper = mount( AddressPage, {
			localVue,
			propsData: {
				validateAddressUrl: 'https://example.com/address-check',
				validateEmailUrl: 'https://example.com/email-check',
				countries: [],
				salutations: [],
				showMembershipTypeOption: true,
				addressValidationPatterns: {},
				dateOfBirthValidationPattern: '',
			},
			store: createStore(),
			// stubs: {
			// 	AddressFields: true,
			// },
			mocks: {
				$t: ( key: string ): string => { return key; },
			},
		} );
	} );

	it( 'toggle membership type visibility', () => {
		wrapper.findComponent( MembershipType );
		expect( wrapper.findComponent( MembershipType ).exists() ).toBe( true );
		wrapper.setProps( { showMembershipTypeOption: false } );
		expect( wrapper.findComponent( MembershipType ).exists() ).toBe( false );
	} );

	//TODO : Write more tests

} );
