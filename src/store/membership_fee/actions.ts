import { ActionContext } from 'vuex';

import { GenericValuePayload, InitialMembershipFeeValues, MembershipFee } from '@src/view_models/MembershipFee';

import {
	MARK_EMPTY_FEE_INVALID,
	MARK_EMPTY_FIELDS_INVALID,
	SET_FEE,
	SET_FEE_VALIDITY,
	SET_INTERVAL,
	SET_INTERVAL_VALIDITY,
	SET_IS_VALIDATING,
} from '@src/store/membership_fee/mutationTypes';
import { ValidationResponse } from '@src/store/ValidationResponse';
import { Validity } from '@src/view_models/Validity';
import { Helper } from '@src/store/util';
import { validateFeeDataRemotely } from '@src/store/axios';
import { SET_TYPE, SET_TYPE_VALIDITY } from '@src/store/payment/mutationTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

/**
 * Map source values from WMDE\Fundraising\MembershipContext\Domain\MembershipPaymentValidator to validation mutation functions
 * We'll use this map to process the result from the server-side validation
 */
const fieldToValidationMutation = new Map( [
	[ 'fee', SET_FEE_VALIDITY ],
	[ 'interval', SET_INTERVAL_VALIDITY ],
	[ 'type', SET_TYPE_VALIDITY ],
] );

const validateFeeOnClientSide = ( fee: string ): Validity => {
	if ( Helper.isNonNumeric( fee ) ) {
		return Validity.INVALID;
	}
	return Validity.VALID;
};

export const actions = {
	initializeMembershipFee( context: ActionContext<MembershipFee, any>, initialData: InitialMembershipFeeValues ) {
		if ( initialData.fee ) {
			context.commit( SET_FEE, initialData.fee );
			const feeValidity: Validity = validateFeeOnClientSide( initialData.fee );
			context.commit( SET_FEE_VALIDITY, feeValidity );
			context.commit( SET_FEE, feeValidity === Validity.VALID ? initialData.fee : '' );
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
			return context.dispatch( 'validateFee', {
				selectedValue: initialData.fee,
				validateFeeUrl: initialData.validateFeeUrl,
			} );
		}
	},
	markEmptyValuesAsInvalid( context: ActionContext<MembershipFee, any> ): void {
		context.commit( MARK_EMPTY_FIELDS_INVALID );
	},
	markEmptyFeeAsInvalid( context: ActionContext<MembershipFee, any> ): void {
		context.commit( MARK_EMPTY_FEE_INVALID );
	},
	validateFee( context: ActionContext<MembershipFee, any>, payload: GenericValuePayload ): Promise<void> {
		context.commit( SET_IS_VALIDATING, true );
		return validateFeeDataRemotely(
			context,
			payload.validateFeeUrl,
			payload.selectedValue,
			context.state.values.interval,
			context.state.values.type,
		).then( ( validationResult: ValidationResponse ) => {
			fieldToValidationMutation.forEach( ( mutationFunction, errorSource ) => {
				context.commit( mutationFunction, Helper.validationSucceeded( validationResult, errorSource ) );
			} );
			context.commit( SET_IS_VALIDATING, false );
		} );
	},
	setFee( context: ActionContext<MembershipFee, any>, payload: GenericValuePayload ): Promise<void> {
		context.commit( SET_FEE, payload.selectedValue );
		const feeValidity: Validity = validateFeeOnClientSide( payload.selectedValue );
		context.commit( SET_FEE_VALIDITY, feeValidity );
		context.commit( SET_FEE, feeValidity === Validity.VALID ? payload.selectedValue : '' );

		// Trigger server-side validation on full completion
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( 'validateFee', payload );
		}
		return Promise.resolve();
	},
	resetFeeForAddressType( context: ActionContext<MembershipFee, any>, addressType: AddressTypeModel ): Promise<void> {
		if ( context.state.values.fee < context.getters.minimumAmount( addressType ) ) {
			context.commit( SET_FEE, '' );
			context.commit( SET_FEE_VALIDITY, Validity.INCOMPLETE );
		}
		return Promise.resolve();
	},
	setInterval( context: ActionContext<MembershipFee, any>, payload: GenericValuePayload ): Promise<void> {
		context.commit( SET_INTERVAL, payload.selectedValue );

		// Trigger client-side validation - store will inspect set value
		context.commit( SET_INTERVAL_VALIDITY );

		// Trigger server-side validation on full completion
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( 'validateFee', {
				selectedValue: context.state.values.fee,
				// validateFeeUrl should not be part of the payload, see https://phabricator.wikimedia.org/T315068
				validateFeeUrl: payload.validateFeeUrl,
			} );
		}
		return Promise.resolve();
	},
	setType( context: ActionContext<MembershipFee, any>, payload: GenericValuePayload ): Promise<void> {
		context.commit( SET_TYPE, payload.selectedValue );
		// Trigger client-side validation - store will inspect set value
		context.commit( SET_TYPE_VALIDITY );
		if ( context.getters.allPaymentValuesAreSet ) {
			return context.dispatch( 'validateFee', {
				selectedValue: context.state.values.fee,
				validateFeeUrl: payload.validateFeeUrl,
			} );
		}
		return Promise.resolve();
	},
};
