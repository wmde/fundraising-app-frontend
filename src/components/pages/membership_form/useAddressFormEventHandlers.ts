import { Store } from 'vuex';
import { action } from '@src/store/util';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { computed, ComputedRef, ref, Ref } from 'vue';

type ReturnType = {
	submit: () => Promise<void>,
	previousPage: () => void,
    submitValuesForm: Ref<HTMLFormElement>,
	showErrorSummary: Ref<boolean>,
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
	const bankDataIsValid = ref<boolean>( true );
	const addressDataIsValid = ref<boolean>( true );
	const dateOfBirthIsValid = ref<boolean>( true );
	const showErrorSummary = computed<boolean>( () => !bankDataIsValid.value || !addressDataIsValid.value || !dateOfBirthIsValid.value );
	const submit = async (): Promise<void> => {
		const validationCalls: Promise<any>[] = [
			store.dispatch( action( 'membership_address', 'validateAddress' ), validateAddressUrl ),
			store.dispatch( action( 'membership_address', 'validateEmail' ), validateEmailUrl ),
		];

		if ( isDirectDebit.value ) {
			validationCalls.push( store.dispatch( action( 'bankdata', 'markEmptyFieldsAsInvalid' ) ) );
		}

		await Promise.all( validationCalls );
		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ 'membership_address/requiredFieldsAreValid' ] ) {
			addressDataIsValid.value = false;
			return;
		}
		if ( isDirectDebit.value && !store.getters[ 'bankdata/bankDataIsValid' ] ) {
			bankDataIsValid.value = false;
			return;
		}
		if ( !store.getters[ 'membership_address/dateOfBirthIsValid' ] ) {
			dateOfBirthIsValid.value = false;
			return;
		}

		trackAddressForm();
		submitValuesForm.value.submit();
	};

	const previousPage = async () => {
		emit( 'previous-page' );
	};

	store.watch( ( state, getters ) => getters[ 'membership_address/requiredFieldsAreValid' ], ( isValid: boolean ) => {
		if ( !addressDataIsValid.value && isValid ) {
			addressDataIsValid.value = true;
		}
	} );

	store.watch( ( state, getters ) => getters[ 'bankdata/bankDataIsValid' ], ( isValid: boolean ) => {
		if ( !bankDataIsValid.value && isValid ) {
			bankDataIsValid.value = true;
		}
	} );

	store.watch( ( state, getters ) => getters[ 'membership_address/dateOfBirthIsValid' ], ( isValid: boolean ) => {
		if ( !dateOfBirthIsValid.value && isValid ) {
			dateOfBirthIsValid.value = true;
		}
	} );

	return {
		submit,
		previousPage,
		submitValuesForm,
		showErrorSummary,
	};
}
