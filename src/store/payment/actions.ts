import { ActionContext } from 'vuex';
import { IntervalData, TypeData } from '@src/view_models/Payment';
import { DonationPayment } from '@src/store/payment/types';
import { Validity } from '@src/view_models/Validity';
import { isValidAmount } from '@src/store/amountValidator';
import { PaymentInitialisationPayload } from '@src/view_models/PaymentInitialisationPayload';
import { isValidPaymentType } from '@src/store/paymentTypeValidator';
import { isValidInterval } from '@src/store/intervalValidator';

export const actions = {
	discardInitialization( context: ActionContext<DonationPayment, any> ): void {
		context.commit( 'SET_INITIALIZED', false );
	},
	initializePayment( context: ActionContext<DonationPayment, any>, payload: PaymentInitialisationPayload ): Promise<boolean> {
		const { initialValues, allowedPaymentTypes, allowedIntervals } = payload;

		const amountIsValid = isValidAmount( Number( initialValues.amount ) );
		const intervalIsValid = isValidInterval( initialValues.paymentIntervalInMonths, allowedIntervals );
		const paymentTypeIsValid = isValidPaymentType( initialValues.type, initialValues.paymentIntervalInMonths, allowedPaymentTypes );

		if ( amountIsValid ) {
			context.commit( 'SET_AMOUNT', initialValues.amount );
			context.commit( 'SET_AMOUNT_VALIDITY', Validity.VALID );
		}

		context.commit( 'SET_INTERVAL', intervalIsValid ? initialValues.paymentIntervalInMonths : '0' );

		if ( paymentTypeIsValid ) {
			context.commit( 'SET_TYPE', initialValues.type );
			context.commit( 'SET_TYPE_VALIDITY', Validity.VALID );
		}

		const paymentIsFilledAndValid = amountIsValid && paymentTypeIsValid;
		context.commit( 'SET_INITIALIZED', paymentIsFilledAndValid );

		return Promise.resolve( paymentIsFilledAndValid );
	},
	markEmptyValuesAsInvalid( context: ActionContext<DonationPayment, any> ): void {
		context.commit( 'MARK_EMPTY_FIELDS_INVALID' );
	},
	markEmptyAmountAsInvalid( context: ActionContext<DonationPayment, any> ): void {
		context.commit( 'MARK_EMPTY_AMOUNT_INVALID' );
	},
	setAmount( context: ActionContext<DonationPayment, any>, payload: string ): void {
		const isValid = isValidAmount( Number( payload ) );
		context.commit( 'SET_AMOUNT', payload );
		context.commit( 'SET_AMOUNT_VALIDITY', isValid ? Validity.VALID : Validity.INVALID );
	},
	setInterval( context: ActionContext<DonationPayment, any>, payload: IntervalData ): void {
		context.commit( 'SET_INTERVAL', payload );
	},
	setType( context: ActionContext<DonationPayment, any>, payload: TypeData ): void {
		context.commit( 'SET_TYPE', payload );
		context.commit( 'SET_TYPE_VALIDITY' );
	},
};
