import { mount } from '@vue/test-utils';
import Payment from '@src/components/pages/membership_form/Payment.vue';
import PaymentType from '@src/components/pages/membership_form/PaymentType.vue';
import AmountSelection from '@src/components/shared/AmountSelection.vue';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import PaymentInterval from '@src/components/shared/PaymentInterval.vue';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { setFee, setInterval, setType } from '@src/store/membership_fee/actionTypes';

describe( 'Payment.vue', () => {
	let wrapper: any;
	beforeEach( () => {
		wrapper = mount( Payment, {
			props: {
				validateFeeUrl: 'https://example.com/amount-check',
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'UEB' ],
				validateBankDataUrl: 'https://example.com/amount-check',
				validateLegacyBankDataUrl: 'https://example.com/amount-check',
			},
			global: {
				plugins: [ createStore() ],
			},
		} );
	} );

	it( 'sets correct amount title when interval is selected', async () => {
		const interval1 = wrapper.find( '#interval-1 input' );
		const interval12 = wrapper.find( '#interval-12 input' );
		const amountSelection = wrapper.findComponent( AmountSelection );

		expect( amountSelection.vm.$props.title ).toEqual( 'membership_form_payment_amount_title' );

		await interval1.trigger( 'change' );
		expect( amountSelection.vm.$props.title ).toEqual( 'membership_form_payment_amount_title_interval_1' );

		await interval12.trigger( 'change' );
		expect( amountSelection.vm.$props.title ).toEqual( 'membership_form_payment_amount_title_interval_12' );
	} );

	it( 'shows bank data when payment type is selected', async () => {
		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeFalsy();

		await wrapper.find( '#payment-bez input' ).trigger( 'change' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeTruthy();
	} );

	it( 'sends interval to store when interval selection emits event ', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		wrapper.findComponent( PaymentInterval ).vm.$emit( 'interval-selected', 6 );

		expect( store.dispatch ).toBeCalledWith(
			action( NS_MEMBERSHIP_FEE, setInterval ),
			{ 'selectedInterval': 6, 'validateFeeUrl': 'https://example.com/amount-check' }
		);
	} );

	it( 'sends payment type to store when payment selection emits event ', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		wrapper.findComponent( PaymentType ).vm.$emit( 'payment-type-selected', 'BEZ' );

		expect( store.dispatch ).toBeCalledWith( action( NS_MEMBERSHIP_FEE, setType ), { 'selectedType': 'BEZ', 'validateFeeUrl': 'https://example.com/amount-check' } );
	} );

	it( 'sends amount to store when amount selection emits event ', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		wrapper.findComponent( AmountSelection ).vm.$emit( 'amount-selected', '1500' );

		expect( store.dispatch ).toBeCalledWith(
			action( NS_MEMBERSHIP_FEE, setFee ),
			{ 'feeValue': '1500', 'validateFeeUrl': 'https://example.com/amount-check' }
		);
	} );
} );
