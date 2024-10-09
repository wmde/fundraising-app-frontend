import { Store } from 'vuex';
import { trackFormSubmission } from '@src/util/tracking';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { AddressTypeIds } from '@src/components/pages/donation_form/AddressTypeIds';
import { computed, ComputedRef, ref, Ref, watch } from 'vue';
import { Validity } from '@src/view_models/Validity';

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

	trackFormSubmission( currentAddressForm );
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
		];

		if ( store.state.address.addressType !== AddressTypeModel.ANON ) {
			validationCalls.push( store.dispatch( action( 'address', 'validateAddress' ), validateAddressUrl ) );
			validationCalls.push( store.dispatch( action( 'address', 'validateEmail' ), validateEmailUrl ) );
		}

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

		// Track the form submission with the Matomo Form Analytics plugin
		// The form is a different one than the one for the submitValuesForm
		trackFormSubmissionForAddressType( addressType.value );
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
			store.dispatch( action( 'bankdata', 'setBankDataValidity' ), Validity.VALID );
		}
	} );

	return {
		submit,
		submitValuesForm,
		showErrorSummary,
	};
}
