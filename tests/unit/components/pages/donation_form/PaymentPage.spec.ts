import { action } from '@src/store/util';
import { NS_PAYMENT } from '@src/store/namespaces';
import { markEmptyValuesAsInvalid } from '@src/store/payment/actionTypes';
import { mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import PaymentPage from '@src/components/pages/donation_form/subpages/PaymentPage.vue';
import { createStore } from '@src/store/donation_store';

jest.mock( '@src/tracking', () => {
	return {
		trackFormSubmission: jest.fn(),
		trackDynamicForm: jest.fn(),
	};
} );

jest.mock( '@src/scroll_to_first_error', () => {
	return jest.fn();
} );

const salutations = [
	{
		'label': 'Herr',
		'value': 'Herr',
		'display': 'Herr',
	},
	{
		'label': 'Frau',
		'value': 'Frau',
		'display': 'Frau',
	},
];

describe( 'PaymentPage.vue', () => {

	const getWrapper = ( store: Store<any> ): VueWrapper<any> => {
		return mount( PaymentPage, {
			props: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				salutations,
			},
			global: {
				plugins: [ store ],
				stubs: {
					Payment: { template: '<div class="i-am-payment" />' },
				},
			},
		} );
	};

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
	} );

	it( 'validates the input before going to the next page', async () => {
		const store = createStore();
		store.dispatch = jest.fn().mockResolvedValue( true );
		const wrapper = getWrapper( store );

		await wrapper.find( '#next' ).trigger( 'click' );

		expect( store.dispatch ).toHaveBeenCalledWith( action( NS_PAYMENT, markEmptyValuesAsInvalid ) );
	} );

	it( 'doesn\'t load the next page if there are validation errors', async () => {
		const store = createStore();
		store.dispatch = jest.fn().mockResolvedValue( true );
		const wrapper = getWrapper( store );

		await wrapper.find( '#next' ).trigger( 'click' );

		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( false );
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );
} );
