import { MutationTree } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { Helper } from '@src/store/util';
import type { AddressState, InputField } from '@src/view_models/Address';
import type { FieldInitialization } from '@src/view_models/FieldInitialization';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

export const mutations: MutationTree<AddressState> = {
	VALIDATE_INPUT( state: AddressState, field: InputField ) {
		if ( field.value === '' && field.optionalField ) {
			state.validity[ field.name ] = Validity.VALID;
		} else {
			state.validity[ field.name ] = Helper.inputIsValid( field.value, field.pattern );
		}
	},
	MARK_EMPTY_FIELDS_INVALID( state: AddressState ) {
		let addressTypeRequirements = state.requiredFields[ state.addressType ];
		state.requiredFields[ state.addressType ].forEach( ( fieldName: string ) => {
			if ( state.validity[ fieldName ] === Validity.INCOMPLETE &&
				addressTypeRequirements[ addressTypeRequirements.indexOf( fieldName ) ] ) {
				state.validity[ fieldName ] = Validity.INVALID;
			}
		} );
		if ( state.validity.addressType === Validity.INCOMPLETE ) {
			state.validity.addressType = Validity.INVALID;
		}
	},
	/**
	 * This is a hacky workaround for test C24_WMDE_Desktop_DE_01 if we move to that style of form we
	 * need to add proper store fields to handle it, if not then we should delete this
	 */
	markEmptyDonationReceiptFieldsAsInvalid( state: AddressState, receiptNeeded: boolean | null ) {
		const addressTypeRequirements = state.requiredFields[ receiptNeeded === null ? AddressTypeModel.EMAIL : state.addressType ];
		state.requiredFields[ state.addressType ].forEach( ( fieldName: string ) => {
			if ( state.validity[ fieldName ] === Validity.INCOMPLETE &&
				addressTypeRequirements[ addressTypeRequirements.indexOf( fieldName ) ] ) {
				state.validity[ fieldName ] = Validity.INVALID;
			}
		} );
		if ( state.validity.addressType === Validity.INCOMPLETE ) {
			state.validity.addressType = Validity.INVALID;
		}
	},
	BEGIN_ADDRESS_VALIDATION( state: AddressState ) {
		state.serverSideValidationCount++;
	},
	FINISH_ADDRESS_VALIDATION( state: AddressState, payload ) {
		state.serverSideValidationCount--;
		if ( payload.status === 'OK' ) {
			return;
		}
		state.requiredFields[ state.addressType ].forEach( name => {
			if ( payload.messages[ name ] ) {
				state.validity[ name ] = Validity.INVALID;
			}
		} );
	},
	BEGIN_EMAIL_VALIDATION( state: AddressState ) {
		state.serverSideValidationCount++;
	},
	FINISH_EMAIL_VALIDATION( state: AddressState, payload ) {
		state.serverSideValidationCount--;
		if ( payload.status === 'OK' ) {
			return;
		}
		if ( state.requiredFields[ state.addressType ].indexOf( 'email' ) > -1 ) {
			state.validity.email = Validity.INVALID;
		}
	},
	SET_ADDRESS_TYPE( state: AddressState, type ) {
		state.addressType = type;
	},
	SET_ADDRESS_FIELDS( state: AddressState, fields ) {
		Object.keys( fields ).forEach( ( field: string ) => {
			const fieldName = fields[ field ];
			if ( state.validity[ fieldName.name ] !== Validity.INVALID ) {
				state.values[ fieldName.name ] = fieldName.value;
			}
		} );
	},
	SET_ADDRESS_FIELD( state: AddressState, field: InputField ) {
		state.values[ field.name ] = field.value;
	},
	SET_NEWSLETTER( state: AddressState, choice ) {
		state.newsletter = choice;
	},
	SET_RECEIPT( state: AddressState, choice ) {
		state.receipt = choice;
	},
	SET_VALIDITY( state: AddressState, { name, value } ) {
		state.validity[ name ] = value;
	},
	INITIALIZE_ADDRESS( state: AddressState, fields: FieldInitialization[] ) {
		fields.forEach( ( field: FieldInitialization ) => {
			state.validity[ field.name ] = field.validity;
			state.values[ field.name ] = field.value;
		} );
	},
	SET_SALUTATION( state: AddressState, salutation: string ) {
		state.values.salutation = salutation;
	},
};
