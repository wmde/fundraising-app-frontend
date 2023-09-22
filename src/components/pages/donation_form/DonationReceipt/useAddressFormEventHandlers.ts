import { Store } from 'vuex';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@src/store/namespaces';
import { validateAddress, validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/wait_for_server_validation';
import { discardInitialization } from '@src/store/payment/actionTypes';
import { ComputedRef, Ref } from 'vue';

const scrollToFirstError = () => {
	document.getElementsByClassName( 'help is-danger' )[ 0 ]
		.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
};

type ReturnType = {
	submit: () => Promise<void>,
	previousPage: () => void,
}

export function useAddressFormEventHandlers(
	store: Store<any>,
	emit: ( eventName: string ) => void,
	isDirectDebit: ComputedRef<any>,
	validateAddressUrl: string,
	validateEmailUrl: string,
	submitForm: Ref<HTMLFormElement>
): ReturnType {
	const submit = async () => {
		const validationCalls: Promise<any>[] = [
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

		await Promise.all( validationCalls );
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

		submitForm.value.submit();
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
