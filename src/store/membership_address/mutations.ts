import { MutationTree } from 'vuex';
import { Helper } from '@src/store/util';
import { REQUIRED_FIELDS } from '@src/store/membership_address/constants';
import { Validity } from '@src/view_models/Validity';
import { InputField, MembershipAddressState } from '@src/view_models/Address';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';

export const mutations: MutationTree<MembershipAddressState> = {
	VALIDATE_INPUT( state: MembershipAddressState, field: InputField ) {
		if ( field.value === '' && field.optionalField ) {
			state.validity[ field.name ] = Validity.INCOMPLETE;
		} else {
			state.validity[ field.name ] = Helper.inputIsValid( field.value, field.pattern );
		}
	},
	MARK_EMPTY_FIELDS_INVALID( state: MembershipAddressState ) {
		REQUIRED_FIELDS[ state.addressType ].forEach( ( fieldName: string ) => {
			if ( state.validity[ fieldName ] === Validity.INCOMPLETE ) {
				state.validity[ fieldName ] = Validity.INVALID;
			}
		} );
	},
	BEGIN_ADDRESS_VALIDATION( state: MembershipAddressState ) {
		state.serverSideValidationCount++;
	},
	FINISH_ADDRESS_VALIDATION( state: MembershipAddressState, payload ) {
		state.serverSideValidationCount--;
		if ( payload.status === 'OK' ) {
			return;
		}
		REQUIRED_FIELDS[ state.addressType ].forEach( name => {
			if ( payload.messages[ name ] ) {
				state.validity[ name ] = Validity.INVALID;
			}
		} );
	},
	BEGIN_EMAIL_VALIDATION( state: MembershipAddressState ) {
		state.serverSideValidationCount++;
	},
	FINISH_EMAIL_VALIDATION( state: MembershipAddressState, payload ) {
		state.serverSideValidationCount--;
		if ( payload.status === 'OK' ) {
			return;
		}
		if ( REQUIRED_FIELDS[ state.addressType ].indexOf( 'email' ) > 0 ) {
			state.validity.email = Validity.INVALID;
		}
	},
	SET_ADDRESS_TYPE( state: MembershipAddressState, type: AddressTypeModel ) {
		state.addressType = type;
	},
	SET_ADDRESS_FIELDS( state: MembershipAddressState, fields ) {
		Object.keys( fields ).forEach( ( field: string ) => {
			const fieldName = fields[ field ];
			if ( state.validity[ fieldName.name ] !== Validity.INVALID ) {
				state.values[ fieldName.name ] = fieldName.value;
			}
		} );
	},
	SET_ADDRESS_FIELD( state: MembershipAddressState, field: InputField ) {
		state.values[ field.name ] = field.value;
	},
	SET_ADDRESS_FIELD_VALIDITY( state: MembershipAddressState, payload: { name: string; validity: Validity } ) {
		state.validity[ payload.name ] = payload.validity;
	},

	SET_RECEIPT( state: MembershipAddressState, choice ) {
		state.receipt = choice;
	},
	SET_INCENTIVES( state: MembershipAddressState, incentives ) {
		state.incentives = incentives;
	},
	SET_MEMBERSHIP_TYPE( state: MembershipAddressState, type: MembershipTypeModel ) {
		state.membershipType = type;
	},
	SET_MEMBERSHIP_TYPE_VALIDITY( state: MembershipAddressState, validity: Validity ) {
		state.validity.membershipType = validity;
	},
};
