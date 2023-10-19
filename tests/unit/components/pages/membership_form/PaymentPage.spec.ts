import { mount, VueWrapper } from '@vue/test-utils';
import PaymentPage from '@src/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import MembershipType from '@src/components/pages/membership_form/MembershipType.vue';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { setAddressType } from '@src/store/membership_address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Store } from 'vuex';
import { initializeMembershipFee, setType } from '@src/store/membership_fee/actionTypes';
import { InitialMembershipFeeValues } from '@src/view_models/MembershipFee';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';

describe( 'PaymentPage.vue', () => {
	let wrapper: VueWrapper<any>;
	let store: Store<any>;

	beforeEach( () => {
		store = createStore();
		wrapper = mount( PaymentPage, {
			props: {
				validateFeeUrl: 'https://example.com/amount-check',
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'UEB' ],
				validateBankDataUrl: 'https://example.com/amount-check',
				validateLegacyBankDataUrl: 'https://example.com/amount-check',
				showMembershipTypeOption: true,
			},
			global: {
				plugins: [ store ],
			},
		} );
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		store.dispatch = jest.fn( () => Promise.resolve() );
		const expectedAction = action( NS_MEMBERSHIP_ADDRESS, setAddressType );
		const expectedPayload = AddressTypeModel.PERSON;

		wrapper.findComponent( AddressType ).vm.$emit( 'field-changed', AddressTypeModel.PERSON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'toggle membership type visibility', async () => {
		wrapper.findComponent( MembershipType );
		expect( wrapper.findComponent( MembershipType ).exists() ).toBe( true );

		await wrapper.setProps( { showMembershipTypeOption: false } );

		expect( wrapper.findComponent( MembershipType ).exists() ).toBe( false );
	} );

} );
