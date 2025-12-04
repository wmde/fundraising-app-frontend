import { ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import type {
	AddressState,
	AddressTypeValidationRequest,
	InitialAddressValues,
	InputField,
} from '@src/view_models/Address';
import type { ValidationResponse } from '@src/store/ValidationResponse';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import type { Salutation } from '@src/view_models/Salutation';
import { salutationValueTranslations } from '@src/view_models/salutationValueTranslations';

export const actions = {
	setAddressField( context: ActionContext<AddressState, any>, field: InputField ): void {
		field.value = field.value.trim();
		context.commit( 'SET_ADDRESS_FIELD', field );
	},
	validateAddressField( context: ActionContext<AddressState, any>, field: InputField ) {
		context.commit( 'VALIDATE_INPUT', field );
	},
	setAndValidateAddressField( context: ActionContext<AddressState, any>, field: InputField ) {
		context.dispatch( 'setAddressField', field );
		context.dispatch( 'validateAddressField', field );
	},
	setFieldValidity( context: ActionContext<AddressState, any>, payload: { field: InputField; validity: Validity } ) {
		context.commit( 'SET_FIELD_VALIDITY', payload );
	},
	validateAddress( context: ActionContext<AddressState, any>, validateAddressUrl: string ) {
		context.commit( 'MARK_EMPTY_FIELDS_INVALID' );
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( 'BEGIN_ADDRESS_VALIDATION' );
		const bodyFormData = new FormData();
		Object.keys( context.state.values ).forEach(
			field => bodyFormData.append( field, context.state.values[ field ] )
		);
		bodyFormData.append( 'addressType', addressTypeName( context.state.addressType ) );
		return axios.post( validateAddressUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( 'FINISH_ADDRESS_VALIDATION', validationResult.data );
			return validationResult.data;
		} );

	},
	/**
	 * This is a hacky workaround for test C24_WMDE_Desktop_DE_01 if we move to that style of form we
	 * need to add proper store fields to handle it, if not then we should delete this
	 * Update 2025 campaign: This form is still being used for email campaigns.
	 */
	validateDonationReceiptAddress( context: ActionContext<AddressState, any>, payload: { receiptNeeded: boolean | null; validateAddressUrl: string } ) {
		context.commit( 'MARK_EMPTY_DONATION_FIELDS_AS_INVALID', payload.receiptNeeded );
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( 'BEGIN_ADDRESS_VALIDATION' );
		const bodyFormData = new FormData();
		Object.keys( context.state.values ).forEach(
			field => bodyFormData.append( field, context.state.values[ field ] )
		);
		bodyFormData.append( 'addressType', addressTypeName( context.state.addressType ) );
		return axios.post( payload.validateAddressUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( 'FINISH_ADDRESS_VALIDATION', validationResult.data );
			return validationResult.data;
		} );

	},
	/**
	 * We're performing more hackery here as we need to validate the different donation form address fields
	 * depending on the address type
	 */
	validateAddressOnCompactForm( context: ActionContext<AddressState, any>, validateAddressUrl: string ) {
		context.commit( 'RESET_DYNAMIC_FIELDS_VALIDATION' );
		context.commit( 'MARK_EMPTY_FIELDS_INVALID' );

		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( 'BEGIN_ADDRESS_VALIDATION' );
		const bodyFormData = new FormData();
		Object.keys( context.state.values ).forEach(
			field => bodyFormData.append( field, context.state.values[ field ] )
		);
		bodyFormData.append( 'addressType', addressTypeName( context.state.addressType ) );
		return axios.post( validateAddressUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( 'FINISH_ADDRESS_VALIDATION', validationResult.data );
			return validationResult.data;
		} );
	},
	validateEmail( context: ActionContext<AddressState, any>, validateEmailUrl: string ) {
		if ( !context.getters.requiredFieldsAreValid ) {
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}

		context.commit( 'BEGIN_EMAIL_VALIDATION' );
		const bodyFormData = new FormData();
		bodyFormData.append( 'email', context.state.values.email );

		return axios.post( validateEmailUrl, bodyFormData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} ).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
			context.commit( 'FINISH_EMAIL_VALIDATION', validationResult.data );
			return validationResult.data;
		} );
	},
	setAddressType( context: ActionContext<AddressState, any>, type: AddressTypeModel ) {
		context.commit( 'SET_ADDRESS_TYPE', type );
		context.commit( 'SET_VALIDITY', { name: 'addressType', value: Validity.VALID } );
	},
	validateAddressType( context: ActionContext<AddressState, any>, request: AddressTypeValidationRequest ) {
		if ( request.disallowed.includes( request.type ) ) {
			context.commit( 'SET_VALIDITY', { name: 'addressType', value: Validity.INVALID } );
			return Promise.resolve( { status: 'ERR', messages: [] } );
		}
		return Promise.resolve( { status: 'OK', messages: [] } );
	},
	setNewsletterChoice( context: ActionContext<AddressState, any>, choice: boolean ) {
		context.commit( 'SET_NEWSLETTER', choice );
	},
	setReceiptChoice( context: ActionContext<AddressState, any>, choice: boolean ) {
		context.commit( 'SET_RECEIPT', choice );
	},
	initializeAddress( context: ActionContext<AddressState, any>, initialValues: InitialAddressValues ): void {
		if ( initialValues.addressType !== null && initialValues.addressType !== undefined ) {
			context.commit( 'SET_ADDRESS_TYPE', initialValues.addressType );
			context.commit( 'SET_VALIDITY', { name: 'addressType', value: Validity.VALID } );
		} else {
			context.commit( 'SET_VALIDITY', { name: 'addressType', value: Validity.INCOMPLETE } );
		}
		if ( initialValues.newsletter !== null && initialValues.newsletter !== undefined ) {
			context.commit( 'SET_NEWSLETTER', initialValues.newsletter );
		}
		if ( initialValues.receipt !== null && initialValues.receipt !== undefined ) {
			context.commit( 'SET_RECEIPT', initialValues.receipt );
			context.commit( 'SET_VALIDITY', { name: 'receipt', value: Validity.RESTORED } );
		}
		context.commit( 'INITIALIZE_ADDRESS', initialValues.fields );
	},
	/*
	 * This is used when a user changes language on the address form
	 * It takes the old salutation and looks to see if there's a locale
	 * for it. If you're thinking of improving it, please don't. There
	 * is already a proposal for improving it here:
	 *
	 * https://phabricator.wikimedia.org/T317388
	*/
	adjustSalutationLocale( context: ActionContext<AddressState, any>, payload: { salutations: Salutation[]; salutation: string } ): void {
		if ( payload.salutation === '' ) {
			return;
		}

		const currentSalutation = payload.salutations.find( s => s.value === payload.salutation );
		if ( currentSalutation !== undefined ) {
			context.commit( 'SET_SALUTATION', payload.salutation );
			return;
		}
		context.commit( 'SET_SALUTATION', salutationValueTranslations[ payload.salutation ] );
	},
};
