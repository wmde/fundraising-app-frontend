import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import PaymentPage from '@/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressType from '@/components/pages/membership_form/AddressType.vue';
import MembershipType from '@/components/pages/membership_form/MembershipType.vue';
import { createStore } from '@/store/membership_store';
import { action } from '@/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@/store/namespaces';
import { setAddressType } from '@/store/membership_address/actionTypes';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );

describe( 'PaymentPage.vue', () => {
	let wrapper: any;
	beforeEach( () => {
		wrapper = mount( PaymentPage, {
			localVue,
			propsData: {
				validateFeeUrl: 'https://example.com/amount-check',
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'UEB' ],
				validateBankDataUrl: 'https://example.com/amount-check',
				validateLegacyBankDataUrl: 'https://example.com/amount-check',
				showMembershipTypeOption: true,
			},
			store: createStore(),
			stubs: {
				AmountSelection: true,
			},
			mocks: {
				$t: ( key: string ): string => { return key; },
			},
		} );
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn( () => Promise.resolve() );
		const expectedAction = action( NS_MEMBERSHIP_ADDRESS, setAddressType );
		const expectedPayload = AddressTypeModel.PERSON;
		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.PERSON );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'toggle membership type visibility', async () => {
		wrapper.findComponent( MembershipType );
		expect( wrapper.findComponent( MembershipType ).exists() ).toBe( true );
		await wrapper.setProps( { showMembershipTypeOption: false } );
		expect( wrapper.findComponent( MembershipType ).exists() ).toBe( false );
	} );

} );
