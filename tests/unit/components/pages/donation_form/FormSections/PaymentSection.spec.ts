import { createStore } from '@src/store/donation_store';
import { mount, VueWrapper } from '@vue/test-utils';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import { action } from '@src/store/util';
import PaymentSection from '@src/components/pages/donation_form/FormSections/PaymentSection.vue';
import Payment from '@src/components/pages/donation_form/Payment.vue';

describe( 'PaymentSection.vue', () => {

	afterEach( () => {
		document.getElementsByTagName( 'html' )[ 0 ].innerHTML = '';
	} );

	const getWrapper = ( store: any ): VueWrapper<any> => {
		return mount( PaymentSection, {
			props: {
				paymentAmounts: [ 1000, 2000, 3000 ],
				paymentIntervals: [ 1, 12 ],
				paymentTypes: [ 'direct_debit', 'bank_transfer', 'credit_card' ],
			},
			global: {
				plugins: [ store ],
			},
			attachTo: document.body,
		} );
	};

	it( 'should display the summary when the payment data in the store is valid', async () => {
		const store = createStore();
		await store.dispatch( action( 'payment', 'setAmount' ), '1000' );
		await store.dispatch( action( 'payment', 'setInterval' ), 'monthly' );
		await store.dispatch( action( 'payment', 'setType' ), 'credit_card' );
		const wrapper = getWrapper( store );

		expect( wrapper.findComponent( PaymentSummary ).exists() ).toBe( true );
		expect( wrapper.find( 'form[name="laika-donation-payment"]' ).exists() ).toBe( false );
	} );

	it( 'should display summary and payment type selection when the payment type in store is invalid', async () => {
		const store = createStore();
		await store.dispatch( action( 'payment', 'setAmount' ), '1000' );
		await store.dispatch( action( 'payment', 'setInterval' ), 'monthly' );
		await store.dispatch( action( 'payment', 'setType' ), '' );
		const wrapper = getWrapper( store );

		const paymentComponent = wrapper.findComponent( Payment );
		expect( wrapper.findComponent( PaymentSummary ).exists() ).toBeTruthy();
		expect( paymentComponent.exists() ).toBeTruthy();
		expect( paymentComponent.props().displaySections ).toEqual( [ 'paymentType' ] );
	} );

	it( 'should display the full form when the store is empty', async () => {
		const store = createStore();
		await store.dispatch( action( 'payment', 'setAmount' ), '' );
		await store.dispatch( action( 'payment', 'setInterval' ), '' );
		await store.dispatch( action( 'payment', 'setType' ), '' );

		const wrapper = getWrapper( store );

		expect( wrapper.find( 'form[name="laika-donation-payment"]' ).exists() ).toBe( true );
		expect( wrapper.findComponent( Payment ).exists() ).toBe( true );
		expect( wrapper.findComponent( PaymentSummary ).exists() ).toBe( false );
	} );

	it( 'focuses the amount when the summary is closed', async () => {
		const store = createStore();
		await store.dispatch( action( 'payment', 'setAmount' ), '1000' );
		await store.dispatch( action( 'payment', 'setInterval' ), 'monthly' );
		await store.dispatch( action( 'payment', 'setType' ), 'credit_card' );
		const wrapper = getWrapper( store );

		await wrapper.findComponent( PaymentSummary ).trigger( 'show-payment-form' );
		const selectedAmount = wrapper.find( '#amount-1000' );

		expect( document.activeElement ).toStrictEqual( selectedAmount.element );
	} );
} );
