import { Store } from 'vuex';
import { trackFormSubmission } from '@src/tracking';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@src/store/namespaces';
import { validateAddress, validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/wait_for_server_validation';
import { discardInitialization } from '@src/store/payment/actionTypes';
import { ComputedRef } from 'vue';

const scrollToFirstError = () => {
	document.getElementsByClassName( 'help is-danger' )[ 0 ]
		.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
};

type ReturnType = {
	submit: ( e: Event ) => Promise<void>,
	previousPage: () => void,
}

export function useAddressFormEventHandlers(
	store: Store<any>,
	emit: ( eventName: string ) => void,
	isDirectDebit: ComputedRef<any>,
	validateAddressUrl: string,
	validateEmailUrl: string
): ReturnType {
	const submit = async ( e: Event ) => {
		e.preventDefault();

		await store.dispatch( action( NS_ADDRESS, validateAddressType ), {
			type: store.state.address.addressType,
			disallowed: [ AddressTypeModel.UNSET ],
		} );
		await store.dispatch( action( NS_ADDRESS, validateAddress ), validateAddressUrl );
		await store.dispatch( action( NS_ADDRESS, validateEmail ), validateEmailUrl );

		if ( isDirectDebit.value ) {
			await store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) );
		}

		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ NS_ADDRESS + '/requiredFieldsAreValid' ] ) {
			scrollToFirstError();
			return;
		}

		if ( isDirectDebit.value && !store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
			scrollToFirstError();
			return;
		}

		const form = e.target as HTMLFormElement;

		trackFormSubmission( form );
		form.submit();
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
