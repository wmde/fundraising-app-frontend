import { action } from '@src/store/util';
import { NS_PAYMENT } from '@src/store/namespaces';
import { mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import PaymentPage from '@src/components/pages/donation_form/subpages/PaymentPage.vue';
import { createStore } from '@src/store/donation_store';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { nextTick } from 'vue';

jest.mock( '@src/util/tracking', () => {
	return {
		trackFormSubmission: jest.fn(),
		trackDynamicForm: jest.fn(),
	};
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
				paymentAmounts: [ 500 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				salutations,
			},
			global: {
				plugins: [ store ],
			},
			components: {
				FeatureToggle: createFeatureToggle( [] ),
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

		expect( store.dispatch ).toHaveBeenCalledWith( action( NS_PAYMENT, 'markEmptyValuesAsInvalid' ) );
	} );

	it( 'emits event if there are no validation errors', async () => {
		const store = createStore();
		const wrapper = getWrapper( store );

		await wrapper.find( '#amount-500' ).trigger( 'change' );
		await wrapper.find( '#paymentType-0' ).trigger( 'change' );
		await wrapper.find( '#next' ).trigger( 'click' );

		expect( wrapper.emitted( 'next-page' ) ).toBeTruthy();
	} );

	it( 'doesn\'t emit event if there are validation errors', async () => {
		const store = createStore();
		store.dispatch = jest.fn().mockResolvedValue( true );
		const wrapper = getWrapper( store );

		await wrapper.find( '#next' ).trigger( 'click' );

		expect( wrapper.emitted( 'next-page' ) ).toBeUndefined();
	} );

	it( 'shows and hides the error summary', async () => {
		const store = createStore();
		const wrapper = getWrapper( store );

		await wrapper.find( '#next' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#amount-500' ).trigger( 'change' );
		await wrapper.find( '#paymentType-0' ).trigger( 'change' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );
} );
