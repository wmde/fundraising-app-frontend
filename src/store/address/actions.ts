import { ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import type {
	AddressState,
	AddressTypeValidationRequest,
	InitialAddressValues,
	InputField,
} from '@src/view_models/Address';
import type { ValidationResponse } from '@src/store/ValidationResponse';
import { AddressTypeModel, addressTypeFromName } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import type { Salutation } from '@src/view_models/Salutation';
import { salutationValueTranslations } from '@src/view_models/salutationValueTranslations';
import { getAddressType } from '@src/store/address/addressTypeFunctions';
import { Helper } from '@src/store/util';

export const actions = {
	validateAddressField( context: ActionContext<AddressState, any>, field: InputField ) {
		context.commit( 'VALIDATE_INPUT', field );
	},
	setAddressField( context: ActionContext<AddressState, any>, field: InputField ) {
		field.value = field.value.trim();
		context.commit( 'SET_ADDRESS_FIELD', field );
	},
	setAndValidateAddressField( context: ActionContext<AddressState, any>, field: InputField ) {
		context.dispatch( 'setAddressField', field );
		context.dispatch( 'validateAddressField', field );
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
		bodyFormData.append( 'addressType', getAddressType( context.state ) );
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
	/**
	 * @deprecated
	 */
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
	setIsAnonymous( context: ActionContext<AddressState, any>, isAnonymous: boolean ): void {
		context.commit( 'SET_IS_ANONYMOUS', isAnonymous );
		context.commit( 'SET_VALIDITY', { name: 'isAnonymous', value: Validity.VALID } );
	},
	setIsCompany( context: ActionContext<AddressState, any>, isCompany: boolean ): void {
		context.commit( 'SET_IS_COMPANY', isCompany );
	},
	initializeAddress( context: ActionContext<AddressState, any>, initialValues: InitialAddressValues ): void {
		if ( Helper.hasInitialValue( initialValues.addressType ) ) {
			context.commit( 'SET_ADDRESS_TYPE', addressTypeFromName( initialValues.addressType ) );
			context.commit( 'SET_VALIDITY', { name: 'addressType', value: Validity.VALID } );
		} else {
			context.commit( 'SET_VALIDITY', { name: 'addressType', value: Validity.INCOMPLETE } );
		}

		if ( Helper.hasInitialValue( initialValues.newsletter ) ) {
			context.commit( 'SET_NEWSLETTER', initialValues.newsletter );
		}

		if ( Helper.hasInitialValue( initialValues.receipt ) ) {
			context.commit( 'SET_RECEIPT', initialValues.receipt );
			context.commit( 'SET_VALIDITY', { name: 'receipt', value: Validity.RESTORED } );
		} else if ( [ 'person', 'company_with_contact', 'firma' ].includes( initialValues.addressType ) ) {
			context.commit( 'SET_RECEIPT', true );
		}

		if ( Helper.hasInitialValue( initialValues.isAnonymous ) ) {
			context.commit( 'SET_IS_ANONYMOUS', initialValues.isAnonymous );
			context.commit( 'SET_VALIDITY', { name: 'isAnonymous', value: Validity.RESTORED } );
		} else if ( initialValues.addressType === 'anonym' ) {
			context.commit( 'SET_IS_ANONYMOUS', true );
		}

		if ( Helper.hasInitialValue( initialValues.isCompany ) ) {
			context.commit( 'SET_IS_COMPANY', initialValues.isCompany );
		} else if ( [ 'company_with_contact', 'firma' ].includes( initialValues.addressType ) ) {
			context.commit( 'SET_IS_COMPANY', true );
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
