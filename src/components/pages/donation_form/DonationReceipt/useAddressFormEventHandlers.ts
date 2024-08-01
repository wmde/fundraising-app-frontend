import { Store } from 'vuex';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
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
	isDirectDebit: ComputedRef<any>,
	validateAddressUrl: string,
	validateEmailUrl: string,
	receiptNeeded: Ref<boolean|null>
): ReturnType {
	const submitValuesForm = ref<HTMLFormElement>();
	const bankDataIsValid = ref<boolean>( true );
	const addressDataIsValid = ref<boolean>( true );
	const showErrorSummary = computed<boolean>( () => !bankDataIsValid.value || !addressDataIsValid.value );
	const submit = async () => {
		const validationCalls: Promise<any>[] = [
			store.dispatch( action( 'address', 'validateAddressType' ), {
				type: store.state.address.addressType,
				disallowed: [ AddressTypeModel.UNSET ],
			} ),
			store.dispatch( action( 'address', 'validateDonationReceiptAddress' ), {
				receiptNeeded: receiptNeeded.value,
				validateAddressUrl: validateAddressUrl,
			} ),
			store.dispatch( action( 'address', 'validateEmail' ), validateEmailUrl ),
		];

		if ( isDirectDebit.value ) {
			validationCalls.push( store.dispatch( action( 'bankdata', 'markEmptyFieldsAsInvalid' ) ) );
		}

		await Promise.all( validationCalls );
		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ 'address/requiredFieldsAreValid' ] ) {
			addressDataIsValid.value = false;
			return;
		}

		if ( isDirectDebit.value && !store.getters[ 'bankdata/bankDataIsValid' ] ) {
			bankDataIsValid.value = false;
			return;
		}

		submitValuesForm.value.submit();
	};

	const previousPage = async () => {
		await store.dispatch( action( 'payment', 'discardInitialization' ) );
		emit( 'previous-page' );
	};

	store.watch( ( state, getters ) => getters[ 'address/requiredFieldsAreValid' ], ( isValid: boolean ) => {
		if ( !addressDataIsValid.value && isValid ) {
			addressDataIsValid.value = true;
		}
	} );

	store.watch( ( state, getters ) => getters[ 'bankdata/bankDataIsValid' ], ( isValid: boolean ) => {
		if ( !bankDataIsValid.value && isValid ) {
			bankDataIsValid.value = true;
		}
	} );

	return {
		submit,
		previousPage,
		submitValuesForm,
		showErrorSummary,
	};
}
