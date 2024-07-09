import { ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import {
	setAddressField,
	setAddressType,
	setIncentives,
	setMembershipType,
	setReceiptChoice,
	validateDateOfBirth,
} from '@src/store/membership_address/actionTypes';
import { InitialMembershipAddressValues, InputField, MembershipAddressState } from '@src/view_models/Address';
import { ValidationResponse } from '@src/store/ValidationResponse';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import {
	BEGIN_ADDRESS_VALIDATION,
	BEGIN_EMAIL_VALIDATION,
	FINISH_ADDRESS_VALIDATION,
	FINISH_EMAIL_VALIDATION,
	MARK_EMPTY_FIELDS_INVALID,
	SET_ADDRESS_FIELD,
	SET_ADDRESS_FIELD_VALIDITY,
	SET_ADDRESS_TYPE,
	SET_INCENTIVES,
	SET_MEMBERSHIP_TYPE,
	SET_MEMBERSHIP_TYPE_VALIDITY,
	SET_RECEIPT,
	VALIDATE_INPUT,
} from '@src/store/membership_address/mutationTypes';
import { Validity } from '@src/view_models/Validity';
import { FieldInitialization } from '@src/view_models/FieldInitialization';
import { resetFeeForAddressType, validateFee } from '@src/store/membership_fee/actionTypes';
import { NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { action } from '@src/store/util';

export const actions = {
	initializeAddress( context: ActionContext<MembershipAddressState, any>, initialData: InitialMembershipAddressValues ) {

		if ( initialData.addressType ) {
			context.commit( SET_ADDRESS_TYPE, initialData.addressType );
		}

		if ( initialData.membershipType ) {
			context.commit( SET_MEMBERSHIP_TYPE, initialData.membershipType );
			context.commit( SET_MEMBERSHIP_TYPE_VALIDITY, Validity.VALID );
		}

		if ( initialData.date ) {
			context.commit( SET_ADDRESS_FIELD, { name: 'date', value: initialData.date } );
		}

		if ( initialData.receipt !== null ) {
			context.commit( SET_RECEIPT, initialData.receipt );
		}

		context.commit( SET_INCENTIVES, initialData.incentives );

		initialData.fields.forEach( ( field: FieldInitialization ) => {
			context.commit( SET_ADDRESS_FIELD, { name: field.name, value: field.value } );
			context.commit( SET_ADDRESS_FIELD_VALIDITY, { name: field.name, validity: field.validity } );
		} );
	},
	validateAddressField( context: ActionContext<MembershipAddressState, any>, field: InputField ) {
		context.commit( VALIDATE_INPUT, field );
	},
	[ setAddressField ]( context: ActionContext<MembershipAddressState, any>, field: InputField ) {
		field.value = field.value.trim();
		context.commit( SET_ADDRESS_FIELD, field );
		context.commit( VALIDATE_INPUT, field );
	},
	validateAddress( context: ActionContext<MembershipAddressState, any>, validateAddressUrl: string ) {
		context.commit( MARK_EMPTY_FIELDS_INVALID );
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( BEGIN_ADDRESS_VALIDATION );
		const bodyFormData = new FormData();
		Object.keys( context.state.values ).forEach(
			field => bodyFormData.append( field, context.state.values[ field ] )
		);
		bodyFormData.append( 'addressType', addressTypeName( context.state.addressType ) );

		return axios.post(
			validateAddressUrl,
			bodyFormData,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
			},
		).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( FINISH_ADDRESS_VALIDATION, validationResult.data );
			return validationResult.data;
		} );
	},
	validateEmail( context: ActionContext<MembershipAddressState, any>, validateEmailUrl: string ) {
		context.commit( MARK_EMPTY_FIELDS_INVALID );
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( BEGIN_EMAIL_VALIDATION );
		const bodyFormData = new FormData();
		bodyFormData.append( 'email', context.state.values.email );

		return axios.post( validateEmailUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( FINISH_EMAIL_VALIDATION, validationResult.data );
			return validationResult.data;
		} );
	},
	[ validateDateOfBirth ]( context: ActionContext<MembershipAddressState, any> ) {
		// We don't send the date of birth to the server, instead we rely on it being already validated with the client-side pattern
		const status = context.state.validity.date === Validity.VALID ? 'OK' : 'ERR';
		return Promise.resolve( { status, messages: {} } );
	},
	[ setAddressType ]( context: ActionContext<MembershipAddressState, any>, type: AddressTypeModel ) {
		context.commit( SET_ADDRESS_TYPE, type );
		if ( type === AddressTypeModel.COMPANY && context.getters.membershipType === MembershipTypeModel.ACTIVE ) {
			context.commit( SET_MEMBERSHIP_TYPE_VALIDITY, Validity.INVALID );
		}
		const result = context.dispatch( action( NS_MEMBERSHIP_FEE, resetFeeForAddressType ), type, { root: true } );
		// Trigger server-side re-validation of membership fee when address type changes
		if ( context.rootGetters.allPaymentValuesAreSet ) {
			result.then( () => context.dispatch(
				action( NS_MEMBERSHIP_FEE, validateFee ),
				{
					selectedValue: context.rootState[ NS_MEMBERSHIP_FEE ].values.fee,
					// Hard-coded URL without host name for now
					// validateFeeUrl should not be part of the payload, see https://phabricator.wikimedia.org/T315068
					validateFeeUrl: '/validate-fee',
				},
				{ root: true }
			) );
		}
		return result;
	},

	[ setReceiptChoice ]( context: ActionContext<MembershipAddressState, any>, choice: boolean ) {
		context.commit( SET_RECEIPT, choice );
	},
	[ setIncentives ]( context: ActionContext<MembershipAddressState, any>, incentives: string[] ) {
		context.commit( SET_INCENTIVES, incentives );
	},
	[ setMembershipType ]( context: ActionContext<MembershipAddressState, any>, type: MembershipTypeModel ) {
		context.commit( SET_MEMBERSHIP_TYPE, type );
		context.commit( SET_MEMBERSHIP_TYPE_VALIDITY, Validity.VALID );
	},

};
