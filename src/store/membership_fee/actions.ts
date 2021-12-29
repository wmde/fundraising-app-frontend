import { ActionContext } from 'vuex';

import {
	IntervalData,
	SetFeePayload,
	MembershipFee,
	InitialMembershipFeeValues,
} from '@/view_models/MembershipFee';

import {
	initializeMembershipFee,
	markEmptyFeeAsInvalid,
	markEmptyValuesAsInvalid,
	setFee,
	setInterval,
	validateFee,
} from '@/store/membership_fee/actionTypes';
import {
	MARK_EMPTY_FEE_INVALID,
	MARK_EMPTY_FIELDS_INVALID,
	SET_FEE,
	SET_FEE_VALIDITY,
	SET_INTERVAL,
	SET_INTERVAL_VALIDITY,
	SET_IS_VALIDATING,
} from '@/store/membership_fee/mutationTypes';
import { ValidationResponse } from '@/store/ValidationResponse';
import { Validity } from '@/view_models/Validity';
import { Helper } from '@/store/util';
import { validateFeeDataRemotely } from '@/store/axios';

export const actions = {
	[ initializeMembershipFee ]( context: ActionContext<MembershipFee, any>, initialData: InitialMembershipFeeValues ) {
		if ( initialData.fee ) {
			context.commit( SET_FEE, initialData.fee );
		}

		if ( initialData.interval ) {
			context.commit( SET_INTERVAL, initialData.interval );
			context.commit( SET_INTERVAL_VALIDITY );
		}

		if ( initialData.fee || initialData.interval ) {
			context.commit( SET_IS_VALIDATING, true );
			validateFeeDataRemotely(
				context,
				initialData.validateFeeUrl,
				context.state.values.fee,
				context.state.values.interval
			).then( ( validationResult: ValidationResponse ) => {
				context.commit( SET_FEE_VALIDITY, validationResult.status === 'ERR' ? Validity.INVALID : Validity.VALID );
				context.commit( SET_IS_VALIDATING, false );
			} );
		}
	},
	[ markEmptyValuesAsInvalid ]( context: ActionContext<MembershipFee, any> ): void {
		context.commit( MARK_EMPTY_FIELDS_INVALID );
	},
	[ markEmptyFeeAsInvalid ]( context: ActionContext<MembershipFee, any> ): void {
		context.commit( MARK_EMPTY_FEE_INVALID );
	},
	[ validateFee ]( context: ActionContext<MembershipFee, any>, payload: SetFeePayload ): Promise<void> {
		context.commit( SET_IS_VALIDATING, true );
		return validateFeeDataRemotely(
			context,
			payload.validateFeeUrl,
			payload.feeValue,
			context.state.values.interval
		).then( ( validationResult: ValidationResponse ) => {
			context.commit( SET_FEE_VALIDITY, validationResult.status === 'ERR' ? Validity.INVALID : Validity.VALID );
			context.commit( SET_IS_VALIDATING, false );
		} );
	},
	[ setFee ]( context: ActionContext<MembershipFee, any>, payload: SetFeePayload ): Promise<void> {
		context.commit( SET_FEE, payload.feeValue );
		if ( Helper.isNonNumeric( payload.feeValue ) ) {
			context.commit( SET_FEE_VALIDITY, Validity.INVALID );
			return Promise.resolve();
		}
		if ( Helper.isNonNumeric( context.state.values.interval ) ) {
			context.commit( SET_INTERVAL_VALIDITY );
			return Promise.resolve();
		}
		return context.dispatch( validateFee, payload );
	},
	[ setInterval ]( context: ActionContext<MembershipFee, any>, payload: IntervalData ): Promise<void> {
		context.commit( SET_INTERVAL, payload.selectedInterval );
		context.commit( SET_INTERVAL_VALIDITY );
		if ( Helper.isNonNumeric( context.state.values.fee ) ) {
			return Promise.resolve();
		}
		context.commit( SET_IS_VALIDATING, true );
		return validateFeeDataRemotely(
			context,
			payload.validateFeeUrl,
			context.state.values.fee,
			context.state.values.interval
		).then( ( validationResult: ValidationResponse ) => {
			context.commit( SET_FEE_VALIDITY, validationResult.status === 'ERR' ? Validity.INVALID : Validity.VALID );
			context.commit( SET_IS_VALIDATING, false );
		} );
	},
};
