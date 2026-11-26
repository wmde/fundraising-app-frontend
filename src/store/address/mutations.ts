import { MutationTree } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { Helper } from '@src/store/util';
import type { AddressState, InputField } from '@src/view_models/Address';
import type { FieldInitialization } from '@src/view_models/FieldInitialization';
import { getRequiredFields } from '@src/store/address/addressTypeFunctions';

export const mutations: MutationTree<AddressState> = {
	VALIDATE_INPUT( state: AddressState, field: InputField ) {
		if ( field.value === '' && field.optionalField ) {
			state.validity[ field.name ] = Validity.VALID;
		} else {
			state.validity[ field.name ] = Helper.inputIsValid( field.value, field.pattern );
		}
	},
	MARK_EMPTY_FIELDS_INVALID( state: AddressState ) {
		getRequiredFields( state ).forEach( ( fieldName: string ) => {
			if ( state.validity[ fieldName ] === Validity.INCOMPLETE ) {
				state.validity[ fieldName ] = Validity.INVALID;
			}
		} );
	},
	BEGIN_ADDRESS_VALIDATION( state: AddressState ) {
		state.serverSideValidationCount++;
	},
	FINISH_ADDRESS_VALIDATION( state: AddressState, payload ) {
		state.serverSideValidationCount--;
		if ( payload.status === 'OK' ) {
			return;
		}
		getRequiredFields( state ).forEach( name => {
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
		if ( getRequiredFields( state ).indexOf( 'email' ) > -1 ) {
			state.validity.email = Validity.INVALID;
		}
	},
	/**
	 * @deprecated
	 */
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
	SET_IS_ANONYMOUS( state: AddressState, isAnonymous: boolean ): void {
		state.isAnonymous = isAnonymous;
	},
	SET_IS_COMPANY( state: AddressState, isCompany: boolean ): void {
		state.isCompany = isCompany;
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
