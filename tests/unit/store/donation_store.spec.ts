import { createStore } from '@/store/donation_store';
import { Validity } from '@/view_models/Validity';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { action } from '@/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@/store/namespaces';
import { initializeAddress } from '@/store/address/actionTypes';
import { initializePayment } from '@/store/payment/actionTypes';

describe( 'Donation Store', () => {

	describe( 'Initialization', () => {

		it( 'initializes initial address data when available', async () => {
			const firstName = { name: 'firstName', value: 'Spooky', validity: Validity.RESTORED };
			const lastName = { name: 'lastName', value: 'Magoo', validity: Validity.RESTORED };
			const initialData = {
				addressType: AddressTypeModel.PERSON,
				fields: [ firstName, lastName ],
			};
			const store = createStore();
			await store.dispatch( action( NS_ADDRESS, initializeAddress ), initialData );

			expect( store.state.address.values.firstName ).toBe( firstName.value );
			expect( store.state.address.values.lastName ).toBe( lastName.value );
		} );

		it( 'initializes initial payment data when available', async () => {
			const amount = '1200';
			const type = 'person';
			const paymentIntervalInMonths = '1';
			const isCustomAmount = false;
			const payload = {
				initialValues: {
					amount,
					type,
					paymentIntervalInMonths,
					isCustomAmount,
				},
				maxAmount: 100000,
			};
			const store = createStore();
			await store.dispatch( action( NS_PAYMENT, initializePayment ), payload );

			expect( store.state.payment.values.amount ).toBe( amount );
			expect( store.state.payment.values.type ).toBe( type );
			expect( store.state.payment.values.interval ).toBe( paymentIntervalInMonths );
		} );

		it( 'does not load address page when amount is invalid', () => {
			const amount = '100000000';
			const type = 'person';
			const paymentIntervalInMonths = '1';
			const isCustomAmount = true;

			const payload = {
				initialValues: {
					amount,
					type,
					paymentIntervalInMonths,
					isCustomAmount,
				},
				maxAmount: 100000,
			};

			const store = createStore();
			store.dispatch( action( NS_PAYMENT, initializePayment ), payload );

			expect( store.state.initialized ).toBeFalsy();
		} );
	} );
} );
