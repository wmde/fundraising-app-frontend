import { ActionContext } from 'vuex';
import { InitialPaymentValues, IntervalData, TypeData } from '@/view_models/Payment';
import { DonationPayment } from '@/store/payment/types';

import {
	discardInitialization,
	initializePayment,
	markEmptyAmountAsInvalid,
	markEmptyValuesAsInvalid,
	setAmount,
	setInterval,
	setType,
} from '@/store/payment/actionTypes';
import {
	MARK_EMPTY_AMOUNT_INVALID,
	MARK_EMPTY_FIELDS_INVALID,
	SET_AMOUNT,
	SET_AMOUNT_VALIDITY,
	SET_INITIALIZED,
	SET_INTERVAL,
	SET_TYPE,
	SET_TYPE_VALIDITY,
} from '@/store/payment/mutationTypes';
import { Validity } from '@/view_models/Validity';
import { isValidAmount } from '@/store/amountValidator';

export const actions = {
	[ discardInitialization ]( context: ActionContext<DonationPayment, any> ): void {
		context.commit( SET_INITIALIZED, false );
	},
	[ initializePayment ]( context: ActionContext<DonationPayment, any>, initialValues: InitialPaymentValues ): Promise<boolean> {
		let amountIsFilledAndValid = false, paymentIsFilled = false;
		if ( initialValues.amount && initialValues.amount !== '0' ) {
			amountIsFilledAndValid = isValidAmount( Number( initialValues.amount ) );
			context.commit( SET_AMOUNT, initialValues.amount );
			context.commit( SET_AMOUNT_VALIDITY, amountIsFilledAndValid ? Validity.VALID : Validity.INVALID );
		}

		if ( initialValues.type && initialValues.type !== '' ) {
			context.commit( SET_TYPE, initialValues.type );
			context.commit( SET_TYPE_VALIDITY, Validity.VALID );
			paymentIsFilled = true;
		}
		context.commit( SET_INTERVAL, initialValues.paymentIntervalInMonths );
		context.commit( SET_INITIALIZED, amountIsFilledAndValid && paymentIsFilled );

		return Promise.resolve( amountIsFilledAndValid && paymentIsFilled );
	},
	[ markEmptyValuesAsInvalid ]( context: ActionContext<DonationPayment, any> ): void {
		context.commit( MARK_EMPTY_FIELDS_INVALID );
	},
	[ markEmptyAmountAsInvalid ]( context: ActionContext<DonationPayment, any> ): void {
		context.commit( MARK_EMPTY_AMOUNT_INVALID );
	},
	[ setAmount ]( context: ActionContext<DonationPayment, any>, payload: string ): void {
		const isValid = isValidAmount( Number( payload ) );
		context.commit( SET_AMOUNT, payload );
		context.commit( SET_AMOUNT_VALIDITY, isValid ? Validity.VALID : Validity.INVALID );
	},
	[ setInterval ]( context: ActionContext<DonationPayment, any>, payload: IntervalData ): void {
		context.commit( SET_INTERVAL, payload );
	},
	[ setType ]( context: ActionContext<DonationPayment, any>, payload: TypeData ): void {
		context.commit( SET_TYPE, payload );
		context.commit( SET_TYPE_VALIDITY );
	},
};
