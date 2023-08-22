import { action } from '@src/store/util';
import { NS_PAYMENT } from '@src/store/namespaces';
import { markEmptyValuesAsInvalid } from '@src/store/payment/actionTypes';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import PaymentPage from '@src/components/pages/donation_form/subpages/PaymentPage.vue';
import { nextTick } from 'vue';

jest.mock( '@src/tracking', () => {
	return {
		trackFormSubmission: jest.fn(),
		trackDynamicForm: jest.fn(),
	};
} );

jest.mock( '@src/scroll_to_first_error', () => {
	return jest.fn();
} );

describe( 'PaymentPage.vue', () => {
	let wrapper: any;

	const actions = {
		'payment/markEmptyValuesAsInvalid': jest.fn(),
	};
	const getters = {
		'payment/paymentDataIsValid': jest.fn(),
		'isValidating': () => false,
	};
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
	beforeEach( () => {
		global.window.scrollTo = jest.fn();
		const store = createStore( {
			actions,
			getters,
		} );
		wrapper = mount( PaymentPage, {
			props: {
				paymentAmounts: [ '5' ],
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
	} );

	it( 'validates the input before going to the next page', async () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn().mockResolvedValue( true );
		const expectedAction = action( NS_PAYMENT, markEmptyValuesAsInvalid );
		getters[ 'payment/paymentDataIsValid' ].mockReturnValueOnce( true );
		wrapper.find( '#next' ).trigger( 'click' );

		await nextTick();

		expect( store.dispatch ).toHaveBeenCalledWith( expectedAction );
	} );

	it( 'doesn\'t load the next page if there are validation errors', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn().mockResolvedValue( true );
		getters[ 'payment/paymentDataIsValid' ].mockReturnValueOnce( false );
		wrapper.find( '#next' ).trigger( 'click' );
		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( false );
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );
} );
