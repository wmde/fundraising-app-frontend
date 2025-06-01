import { Validity } from '@src/view_models/Validity';
import type { AddressFormData, PostData } from '@src/view_models/Address';
import type { ValidationResponse } from '@src/store/ValidationResponse';

/**
 * @param namespacesAndName namespace1, namespace2, ..., mutationOrActionName
 */
function buildActionOrMutationName( ...namespacesAndName: string[] ): string {
	return namespacesAndName.join( '/' );
}

export const action = buildActionOrMutationName;
export const mutation = buildActionOrMutationName;

function createBrowserSpecificRegex( pattern: string ) {
	try {
		// eslint-disable-next-line security/detect-non-literal-regexp
		return new RegExp( pattern, 'u' );
	} catch {
		return /\w+/;
	}
}

export const Helper = {
	inputIsValid: function ( value: string, pattern: string, isOptional?: boolean ) {
		if ( isOptional && value === '' ) {
			return Validity.VALID;
		}
		if ( pattern === null ) {
			return value !== '' ? Validity.VALID : Validity.INVALID;
		}
		return createBrowserSpecificRegex( pattern ).test( value ) ? Validity.VALID : Validity.INVALID;
	},
	formatPostData: ( form: AddressFormData ): any => {
		return Object.keys( form ).reduce( ( accumulator: PostData, currentValue: string ) => {
			accumulator[ currentValue ] = form[ currentValue ].value;
			return accumulator;
		}, {} );
	},
	isNonNumeric( value: string ): boolean {
		return value === '' || isNaN( Number( value ) );
	},
	validationSucceeded( validationResponse: ValidationResponse, fieldName: string ): Validity {
		if ( validationResponse.status === 'OK' ) {
			return Validity.VALID;
		}
		return validationResponse.messages[ fieldName ] ? Validity.INVALID : Validity.VALID;
	},
};
