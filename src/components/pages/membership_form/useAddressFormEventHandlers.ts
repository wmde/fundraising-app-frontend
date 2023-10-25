import { Store } from 'vuex';
import { action } from '@src/store/util';
import { NS_BANKDATA, NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { validateAddress, validateEmail } from '@src/store/address/actionTypes';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { ComputedRef, ref, Ref } from 'vue';

const scrollToFirstError = () => {
	document.getElementsByClassName( 'help is-danger' )[ 0 ]
		.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
};

type ReturnType = {
	submit: () => Promise<void>,
	previousPage: () => void,
    submitValuesForm: Ref<HTMLFormElement>,
}

export function useAddressFormEventHandlers(
	store: Store<any>,
	emit: ( eventName: string ) => void,
	isDirectDebit: ComputedRef<boolean>,
	validateAddressUrl: string,
	validateEmailUrl: string,
	trackAddressForm: () => void,
): ReturnType {
	const submitValuesForm = ref<HTMLFormElement>();
	const submit = async (): Promise<void> => {
		const validationCalls: Promise<any>[] = [
			store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateAddress ), validateAddressUrl ),
			store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateEmail ), validateEmailUrl ),
		];

		if ( isDirectDebit.value ) {
			validationCalls.push( store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) ) );
		}

		await Promise.all( validationCalls );
		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ NS_MEMBERSHIP_ADDRESS + '/requiredFieldsAreValid' ] ) {
			scrollToFirstError();
			return;
		}
		if ( isDirectDebit.value && !store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
			scrollToFirstError();
			return;
		}

		trackAddressForm();
		submitValuesForm.value.submit();
	};

	const previousPage = async () => {
		emit( 'previous-page' );
	};

	return {
		submit,
		previousPage,
		submitValuesForm,
	};
}
