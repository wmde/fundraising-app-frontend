import { createStore } from '@src/store/donation_store';
import { Validity } from '@src/view_models/Validity';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';
import { PaymentInitialisationPayload } from '@src/view_models/PaymentInitialisationPayload';

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
			await store.dispatch( action( 'address', 'initializeAddress' ), initialData );

			expect( store.state.address.values.firstName ).toBe( firstName.value );
			expect( store.state.address.values.lastName ).toBe( lastName.value );
		} );

		it( 'initializes initial payment data when available', async () => {
			const amount = '1200';
			const type = 'person';
			const paymentIntervalInMonths = '1';
			const isCustomAmount = false;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 1 ],
				allowedPaymentTypes: [ 'person' ],
				initialValues: {
					amount,
					type,
					paymentIntervalInMonths,
					isCustomAmount,
				},
			};

			const store = createStore();
			await store.dispatch( action( 'payment', 'initializePayment' ), payload );

			expect( store.state.payment.values.amount ).toBe( amount );
			expect( store.state.payment.values.type ).toBe( type );
			expect( store.state.payment.values.interval ).toBe( paymentIntervalInMonths );
		} );
	} );
} );
