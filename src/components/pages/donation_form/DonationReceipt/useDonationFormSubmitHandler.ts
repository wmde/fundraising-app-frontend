import { Store } from 'vuex';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { computed, ComputedRef, ref, Ref, watch } from 'vue';
import { Validity } from '@src/view_models/Validity';

type ReturnType = {
	submit: () => Promise<void>;
	submitValuesForm: Ref<HTMLFormElement>;
	showErrorSummary: Ref<boolean>;
};

export function useDonationFormSubmitHandler(
	store: Store<any>,
	isDirectDebit: ComputedRef<any>,
	validateAddressUrl: string,
	validateEmailUrl: string,
	receiptNeeded: Ref<boolean | null>
): ReturnType {
	const submitValuesForm = ref<HTMLFormElement>();
	const bankDataIsValid = ref<boolean>( true );
	const addressDataIsValid = ref<boolean>( true );
	const paymentDataIsValid = ref<boolean>( true );
	const showErrorSummary = computed<boolean>( () => !bankDataIsValid.value || !addressDataIsValid.value || !paymentDataIsValid.value );
	const submit = async () => {
		const validationCalls: Promise<any>[] = [
			store.dispatch( action( 'payment', 'markEmptyValuesAsInvalid' ) ),
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
			validationCalls.push( store.dispatch( action( 'bankdata', 'markEmptyIbanAsInvalid' ) ) );
		}

		await Promise.all( validationCalls );
		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ 'address/requiredFieldsAreValid' ] ) {
			addressDataIsValid.value = false;
		}

		if ( isDirectDebit.value && store.state.bankdata.validity.iban !== Validity.VALID ) {
			bankDataIsValid.value = false;
		}

		if ( !store.getters[ 'payment/paymentDataIsValid' ] ) {
			paymentDataIsValid.value = false;
		}

		if ( !addressDataIsValid.value || !bankDataIsValid.value || !paymentDataIsValid.value ) {
			return;
		}

		submitValuesForm.value.submit();
	};

	store.watch( ( state, getters ) => getters[ 'address/requiredFieldsAreValid' ], ( isValid: boolean ) => {
		if ( !addressDataIsValid.value && isValid ) {
			addressDataIsValid.value = true;
		}
	} );

	watch( () => store.state.bankdata.validity.iban, ( validity: Validity ) => {
		if ( !bankDataIsValid.value && validity === Validity.VALID ) {
			bankDataIsValid.value = true;
		}
	} );

	store.watch( ( state, getters ) => getters[ 'payment/paymentDataIsValid' ], ( isValid: boolean ) => {
		if ( !paymentDataIsValid.value && isValid ) {
			paymentDataIsValid.value = true;
		}
	} );

	watch( () => store.state.payment.values.type, ( newType: string ) => {
		if ( newType !== 'BEZ' ) {
			bankDataIsValid.value = true;
			store.dispatch( action( 'bankdata', 'setIbanValidity' ), Validity.INCOMPLETE );
		}
	} );

	return {
		submit,
		submitValuesForm,
		showErrorSummary,
	};
}
