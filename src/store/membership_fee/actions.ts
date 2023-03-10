import { ActionContext } from 'vuex';

import { InitialMembershipFeeValues, IntervalData, MembershipFee, SetFeePayload, TypeData } from '@/view_models/MembershipFee';

import {
	initializeMembershipFee,
	markEmptyFeeAsInvalid,
	markEmptyValuesAsInvalid,
	resetFeeForAddressType,
	setFee,
	setInterval,
	setType,
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
import { SET_TYPE, SET_TYPE_VALIDITY } from '@/store/payment/mutationTypes';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';

/**
 * Map source values from WMDE\Fundraising\MembershipContext\Domain\MembershipPaymentValidator to validation mutation functions
 * We'll use this map to process the result from the server-side validation
 */
const fieldToValidationMutation = new Map( [
	[ 'fee', SET_FEE_VALIDITY ],
	[ 'interval', SET_INTERVAL_VALIDITY ],
	[ 'type', SET_TYPE_VALIDITY ],
] );

const validateFeeOnClientSide = ( fee: string ): Validity => Helper.isNonNumeric( fee ) ? Validity.INVALID : Validity.VALID;

export const actions = {
	[ initializeMembershipFee ]( context: ActionContext<MembershipFee, any>, initialData: InitialMembershipFeeValues ) {
		if ( initialData.fee ) {
			context.commit( SET_FEE, initialData.fee );
			context.commit( SET_FEE_VALIDITY, validateFeeOnClientSide( initialData.fee ) );
		}

		if ( initialData.interval ) {
			context.commit( SET_INTERVAL, initialData.interval );
			context.commit( SET_INTERVAL_VALIDITY );
		}

		if ( initialData.type ) {
			context.commit( SET_TYPE, initialData.type );
			context.commit( SET_TYPE_VALIDITY );
		}

		// Trigger server-side validation to restore server-side validation state
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( validateFee, {
				feeValue: initialData.fee,
				validateFeeUrl: initialData.validateFeeUrl,
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
			context.state.values.interval,
			context.state.values.type,
		).then( ( validationResult: ValidationResponse ) => {
			fieldToValidationMutation.forEach( ( mutationFunction, errorSource ) => {
				context.commit( mutationFunction, Helper.validationSucceeded( validationResult, errorSource ) );
			} );
			context.commit( SET_IS_VALIDATING, false );
		} );
	},
	[ setFee ]( context: ActionContext<MembershipFee, any>, payload: SetFeePayload ): Promise<void> {
		context.commit( SET_FEE, payload.feeValue );
		context.commit( SET_FEE_VALIDITY, validateFeeOnClientSide( payload.feeValue ) );

		// Trigger server-side validation on full completion
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( validateFee, payload );
		}
		return Promise.resolve();
	},
	[ resetFeeForAddressType ]( context: ActionContext<MembershipFee, any>, addressType: AddressTypeModel ): Promise<void> {
		if ( context.state.values.fee < context.getters.minimumAmount( addressType ) ) {
			context.commit( SET_FEE, '' );
			context.commit( SET_FEE_VALIDITY, Validity.INCOMPLETE );
		}
		return Promise.resolve();
	},
	[ setInterval ]( context: ActionContext<MembershipFee, any>, payload: IntervalData ): Promise<void> {
		context.commit( SET_INTERVAL, payload.selectedInterval );

		// Trigger client-side validation - store will inspect set value
		context.commit( SET_INTERVAL_VALIDITY );

		// Trigger server-side validation on full completion
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( validateFee, {
				feeValue: context.state.values.fee,
				// validateFeeUrl should not be part of the payload, see https://phabricator.wikimedia.org/T315068
				validateFeeUrl: payload.validateFeeUrl,
			} );
		}
		return Promise.resolve();
	},
	[ setType ]( context: ActionContext<MembershipFee, any>, payload: TypeData ): Promise<void> {
		context.commit( SET_TYPE, payload.selectedType );
		// Trigger client-side validation - store will inspect set value
		context.commit( SET_TYPE_VALIDITY );
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( validateFee, {
				feeValue: context.state.values.fee,
				validateFeeUrl: payload.validateFeeUrl,
			} );
		}
		return Promise.resolve();
	},
};
