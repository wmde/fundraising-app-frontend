import { Store } from 'vuex';
import { trackFormSubmission } from '@src/tracking';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@src/store/namespaces';
import { validateAddress, validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/wait_for_server_validation';
import { discardInitialization } from '@src/store/payment/actionTypes';
import { AddressTypeIds } from '@src/components/pages/donation_form/AddressTypeIds';
import { ComputedRef } from 'vue';

const submitHtmlForm = ( addressType: number ) => {
	const formId = `laika-donation-personal-data-${ AddressTypeIds.get( addressType ) }`;
	const currentAddressForm: HTMLFormElement = document.getElementById( formId ) as HTMLFormElement;
	if ( !currentAddressForm ) {
		// This should only happen if the child component has the wrong ID
		throw new Error( `Address form with ID "${ formId }" not found.` );
	}

	trackFormSubmission( currentAddressForm );
	currentAddressForm.submit();
};

const scrollToFirstError = () => document.getElementsByClassName( 'help is-danger' )[ 0 ]
	.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );

type ReturnType = {
	submit: () => void,
	previousPage: () => void,
}

export function useAddressFormEventHandlers(
	store: Store<any>,
	emit: ( eventName: string ) => void,
	addressType: ComputedRef<any>,
	isDirectDebit: ComputedRef<any>,
	validateAddressUrl: string,
	validateEmailUrl: string
): ReturnType {
	const submit = () => {
		const validationCalls = [
			store.dispatch( action( NS_ADDRESS, validateAddressType ), {
				type: store.state.address.addressType,
				disallowed: [ AddressTypeModel.UNSET ],
			} ),
			store.dispatch( action( NS_ADDRESS, validateAddress ), validateAddressUrl ),
			store.dispatch( action( NS_ADDRESS, validateEmail ), validateEmailUrl ),
		];

		if ( isDirectDebit.value ) {
			validationCalls.push( store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) ) );
		}

		Promise.all( validationCalls ).then( () => {
			// We need to wait for the asynchronous bank data validation, that might still be going on
			waitForServerValidationToFinish( store ).then( () => {
				if ( !store.getters[ NS_ADDRESS + '/requiredFieldsAreValid' ] ) {
					scrollToFirstError();
					return;
				}
				if ( isDirectDebit.value && !store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
					scrollToFirstError();
					return;
				}
				submitHtmlForm( addressType.value );
			} );
		} );
	};

	const previousPage = async () => {
		await store.dispatch( action( NS_PAYMENT, discardInitialization ) );
		emit( 'previous-page' );
	};

	return {
		submit,
		previousPage,
	};
}