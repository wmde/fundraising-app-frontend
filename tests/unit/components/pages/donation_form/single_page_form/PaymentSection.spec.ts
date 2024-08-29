import { action } from '@src/store/util';
import { mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import PaymentSection from '@src/components/pages/donation_form/singlePageFromSections/PaymentSection.vue';
import { createStore } from '@src/store/donation_store';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { nextTick } from 'vue';

jest.mock( '@src/util/tracking', () => {
	return {
		trackFormSubmission: jest.fn(),
		trackDynamicForm: jest.fn(),
	};
} );

describe( 'PaymentSection.vue', () => {

	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( PaymentSection, {
			props: {
				paymentAmounts: [ 500 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
			},
			global: {
				plugins: [ store ],
			},
			components: {
				FeatureToggle: createFeatureToggle( [] ),
			},
		} );
		return { wrapper, store };
	};

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
	} );

	it( 'validates the input on page submit', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn().mockResolvedValue( true );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		expect( store.dispatch ).toHaveBeenCalledWith( action( 'payment', 'markEmptyValuesAsInvalid' ) );
	} );

	it.skip( 'emits event if there are no validation errors', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#amount-500' ).trigger( 'change' );
		await wrapper.find( '#paymentType-0' ).trigger( 'change' );
		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		expect( wrapper.emitted( 'next-page' ) ).toBeTruthy();
	} );

	it.skip( 'doesn\'t emit event if there are validation errors', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn().mockResolvedValue( true );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		expect( wrapper.emitted( 'next-page' ) ).toBeUndefined();
	} );

	it( 'shows and hides the error summary', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#amount-500' ).trigger( 'change' );
		await wrapper.find( '#paymentType-0' ).trigger( 'change' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );
} );
