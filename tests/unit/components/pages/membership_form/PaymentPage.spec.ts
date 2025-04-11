import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import PaymentPage from '@src/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { IBAN } from '@test/data/bankdata';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';

// This is so the error summary scrollIntoView doesn't throw errors
const errorSummaryScrollElement = { scrollIntoView: () => {} };
Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => errorSummaryScrollElement } );

describe( 'PaymentPage.vue', () => {
	let wrapper: VueWrapper<any>;
	let store: Store<any>;

	beforeEach( () => {
		store = createStore();
		wrapper = mount( PaymentPage, {
			props: {
				validateFeeUrl: 'https://example.com/amount-check',
				paymentAmounts: [ 500 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'UEB' ],
				validateBankDataUrl: 'https://example.com/amount-check',
				validateLegacyBankDataUrl: 'https://example.com/amount-check',
				showMembershipTypeOption: true,
			},
			global: {
				plugins: [ store ],
				provide: {
					bankValidationResource: newSucceedingBankValidationResource(),
				},
			},
		} );
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		store.dispatch = jest.fn( () => Promise.resolve() );
		const expectedAction = action( 'membership_address', 'setAddressType' );
		const expectedPayload = AddressTypeModel.PERSON;

		wrapper.findComponent( AddressType ).vm.$emit( 'field-changed', AddressTypeModel.PERSON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'toggle membership type visibility', async () => {
		wrapper.findComponent( MembershipTypeField );
		expect( wrapper.findComponent( MembershipTypeField ).exists() ).toBe( true );

		await wrapper.setProps( { showMembershipTypeOption: false } );

		expect( wrapper.findComponent( MembershipTypeField ).exists() ).toBe( false );
	} );

	it( 'shows and hides the error summary', async () => {
		await wrapper.find( '#next' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#amount-500' ).trigger( 'change' );
		await wrapper.find( '#interval-0' ).trigger( 'change' );
		await wrapper.find( '#paymentType-0' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

} );
