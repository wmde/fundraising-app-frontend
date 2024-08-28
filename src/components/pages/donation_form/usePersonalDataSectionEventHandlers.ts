import { Store } from 'vuex';
import { trackFormSubmission } from '@src/util/tracking';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { AddressTypeIds } from '@src/components/pages/donation_form/AddressTypeIds';
import { computed, ComputedRef, ref, Ref } from 'vue';

const trackFormSubmissionForAddressType = ( addressType: AddressTypeModel ) => {
	if ( addressType === AddressTypeModel.ANON ) {
		// We don't have a separate form for Matomo here
		return;
	}
	const formId = `laika-donation-personal-data-${ AddressTypeIds.get( addressType ) }`;
	const currentAddressForm: HTMLFormElement = document.getElementById( formId ) as HTMLFormElement;
	if ( !currentAddressForm ) {
		// This should only happen if the child component has the wrong ID
		throw new Error( `Address form with ID "${ formId }" not found.` );
	}

	// TODO handle tracking
	// trackFormSubmission( currentAddressForm );
};

type ReturnType = {
	submit: () => Promise<void>,
    submitValuesForm: Ref<HTMLFormElement>,
	showErrorSummary: Ref<boolean>,
}

export function usePersonalDataSectionEventHandlers(
	store: Store<any>,
	addressType: ComputedRef<AddressTypeModel>,
	isDirectDebit: ComputedRef<boolean>,
	validateAddressUrl: string,
	validateEmailUrl: string,
): ReturnType {
	const submitValuesForm = ref<HTMLFormElement>();
	const paymentDataIsValid = ref<boolean>( true );
	const bankDataIsValid = ref<boolean>( true );
	const addressDataIsValid = ref<boolean>( true );
	const showErrorSummary = computed<boolean>( () => !bankDataIsValid.value || !addressDataIsValid.value || !paymentDataIsValid.value );
	const submit = async (): Promise<void> => {
		const validationCalls: Promise<any>[] = [
			store.dispatch( action( 'payment', 'markEmptyValuesAsInvalid' ) ),
			store.dispatch( action( 'address', 'validateAddressType' ), {
				type: store.state.address.addressType,
				disallowed: [ AddressTypeModel.UNSET ],
			} ),
			store.dispatch( action( 'address', 'validateAddress' ), validateAddressUrl ),
			store.dispatch( action( 'address', 'validateEmail' ), validateEmailUrl ),
		];

		if ( isDirectDebit.value ) {
			validationCalls.push( store.dispatch( action( 'bankdata', 'markEmptyFieldsAsInvalid' ) ) );
		}

		await Promise.all( validationCalls );
		// We need to wait for the asynchronous bank data validation, that might still be going on
		await waitForServerValidationToFinish( store );

		if ( !store.getters[ 'payment/paymentDataIsValid' ] ) {
			paymentDataIsValid.value = false;
			return;
		}

		if ( !store.getters[ 'address/requiredFieldsAreValid' ] ) {
			addressDataIsValid.value = false;
			return;
		}

		if ( isDirectDebit.value && !store.getters[ 'bankdata/bankDataIsValid' ] ) {
			bankDataIsValid.value = false;
			return;
		}

		// Track the form submission with the Matomo Form Analytics plugin
		// The form is a different one than the one for the submitValuesForm
		trackFormSubmissionForAddressType( addressType.value );
		submitValuesForm.value.submit();
	};

	store.watch( ( state, getters ) => getters[ 'payment/requiredFieldsAreValid' ], ( isValid: boolean ) => {
		if ( !paymentDataIsValid.value && isValid ) {
			paymentDataIsValid.value = true;
		}
	} );

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
		submitValuesForm,
		showErrorSummary,
	};
}
