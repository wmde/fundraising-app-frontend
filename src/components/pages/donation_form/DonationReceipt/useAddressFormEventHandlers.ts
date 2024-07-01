import { Store } from 'vuex';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@src/store/namespaces';
import { validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { discardInitialization } from '@src/store/payment/actionTypes';
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
			store.dispatch( action( NS_ADDRESS, validateAddressType ), {
				type: store.state.address.addressType,
				disallowed: [ AddressTypeModel.UNSET ],
			} ),
			store.dispatch( action( NS_ADDRESS, 'validateDonationReceiptAddress' ), {
				receiptNeeded: receiptNeeded.value,
				validateAddressUrl: validateAddressUrl,
			} ),
			store.dispatch( action( NS_ADDRESS, validateEmail ), validateEmailUrl ),
		];

		if ( isDirectDebit.value ) {
			validationCalls.push( store.dispatch( action( NS_BANKDATA, markEmptyValuesAsInvalid ) ) );
		}

		await Promise.all( validationCalls );
		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ NS_ADDRESS + '/requiredFieldsAreValid' ] ) {
			addressDataIsValid.value = false;
			return;
		}

		if ( isDirectDebit.value && !store.getters[ NS_BANKDATA + '/bankDataIsValid' ] ) {
			bankDataIsValid.value = false;
			return;
		}

		submitValuesForm.value.submit();
	};

	const previousPage = async () => {
		await store.dispatch( action( NS_PAYMENT, discardInitialization ) );
		emit( 'previous-page' );
	};

	store.watch( ( state, getters ) => getters[ NS_ADDRESS + '/requiredFieldsAreValid' ], ( isValid: boolean ) => {
		if ( !addressDataIsValid.value && isValid ) {
			addressDataIsValid.value = true;
		}
	} );

	store.watch( ( state, getters ) => getters[ NS_BANKDATA + '/bankDataIsValid' ], ( isValid: boolean ) => {
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
