import { ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import {
	setAddressField,
	setAddressType,
	setNewsletterChoice,
	setReceiptChoice,
	validateAddress,
	validateAddressField,
	validateAddressType,
	validateCountry,
	validateEmail,
} from '@src/store/address/actionTypes';
import {
	AddressState,
	AddressTypeValidationRequest,
	CountryValidationFields,
	InitialAddressValues,
	InputField,
} from '@src/view_models/Address';
import { ValidationResponse } from '@src/store/ValidationResponse';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import {
	BEGIN_ADDRESS_VALIDATION,
	FINISH_ADDRESS_VALIDATION,
	FINISH_EMAIL_VALIDATION,
	INITIALIZE_ADDRESS,
	MARK_EMPTY_FIELDS_INVALID,
	SET_ADDRESS_FIELD,
	SET_ADDRESS_TYPE,
	SET_NEWSLETTER,
	SET_RECEIPT,
	SET_VALIDITY,
	VALIDATE_INPUT,
} from '@src/store/address/mutationTypes';
import { Validity } from '@src/view_models/Validity';

export const actions = {
	[ validateAddressField ]( context: ActionContext<AddressState, any>, field: InputField ) {
		context.commit( VALIDATE_INPUT, field );
	},
	[ setAddressField ]( context: ActionContext<AddressState, any>, field: InputField ) {
		field.value = field.value.trim();
		context.commit( SET_ADDRESS_FIELD, field );
		context.commit( VALIDATE_INPUT, field );
	},
	[ validateCountry ]( context: ActionContext<AddressState, any>, countryValidation: CountryValidationFields ) {
		context.commit( SET_ADDRESS_FIELD, countryValidation.country );
		context.commit( VALIDATE_INPUT, countryValidation.country );
		context.commit( SET_ADDRESS_FIELD, countryValidation.postcode );
		context.commit( VALIDATE_INPUT, countryValidation.postcode );
	},
	[ validateAddress ]( context: ActionContext<AddressState, any>, validateAddressUrl: string ) {
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
		return axios.post( validateAddressUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( FINISH_ADDRESS_VALIDATION, validationResult.data );
			return validationResult.data;
		} );

	},
	/**
	 * This is a hacky workaround for test C24_WMDE_Desktop_DE_01 if we move to that style of form we
	 * need to add proper store fields to handle it, if not then we should delete this
	 */
	validateDonationReceiptAddress( context: ActionContext<AddressState, any>, payload: { receiptNeeded: boolean | null, validateAddressUrl: string } ) {
		context.commit( 'markEmptyDonationReceiptFieldsAsInvalid', payload.receiptNeeded );
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( BEGIN_ADDRESS_VALIDATION );
		const bodyFormData = new FormData();
		Object.keys( context.state.values ).forEach(
			field => bodyFormData.append( field, context.state.values[ field ] )
		);
		bodyFormData.append( 'addressType', addressTypeName( context.state.addressType ) );
		return axios.post( payload.validateAddressUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( FINISH_ADDRESS_VALIDATION, validationResult.data );
			return validationResult.data;
		} );

	},
	[ validateEmail ]( context: ActionContext<AddressState, any>, validateEmailUrl: string ) {
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( 'BEGIN_EMAIL_VALIDATION' );
		const bodyFormData = new FormData();
		bodyFormData.append( 'email', context.state.values.email );

		return axios.post( validateEmailUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( FINISH_EMAIL_VALIDATION, validationResult.data );
			return validationResult.data;
		} );
	},
	[ setAddressType ]( context: ActionContext<AddressState, any>, type: AddressTypeModel ) {
		context.commit( SET_ADDRESS_TYPE, type );
		context.commit( SET_VALIDITY, { name: 'addressType', value: Validity.VALID } );
	},
	[ validateAddressType ]( context: ActionContext<AddressState, any>, request: AddressTypeValidationRequest ) {
		if ( request.disallowed.includes( request.type ) ) {
			context.commit( SET_VALIDITY, { name: 'addressType', value: Validity.INVALID } );
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}
		return Promise.resolve( { status: 'OK', messages: [] } );
	},
	[ setNewsletterChoice ]( context: ActionContext<AddressState, any>, choice: boolean ) {
		context.commit( SET_NEWSLETTER, choice );
	},
	[ setReceiptChoice ]( context: ActionContext<AddressState, any>, choice: boolean ) {
		context.commit( SET_RECEIPT, choice );
	},
	initializeAddress( context: ActionContext<AddressState, any>, initialValues: InitialAddressValues ): void {
		if ( initialValues.addressType !== null && initialValues.addressType !== undefined ) {
			context.commit( SET_ADDRESS_TYPE, initialValues.addressType );
			context.commit( SET_VALIDITY, { name: 'addressType', value: Validity.VALID } );
		} else {
			context.commit( SET_VALIDITY, { name: 'addressType', value: Validity.INCOMPLETE } );
		}
		if ( initialValues.newsletter !== null && initialValues.newsletter !== undefined ) {
			context.commit( SET_NEWSLETTER, initialValues.newsletter );
		}
		if ( initialValues.receipt !== null && initialValues.receipt !== undefined ) {
			context.commit( SET_RECEIPT, initialValues.receipt );
			context.commit( SET_VALIDITY, { name: 'receipt', value: Validity.RESTORED } );
		}
		context.commit( INITIALIZE_ADDRESS, initialValues.fields );
	},

};
