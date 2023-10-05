import { Store } from 'vuex';
import { trackFormSubmission } from '@src/util/tracking';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_BANKDATA, NS_PAYMENT } from '@src/store/namespaces';
import { validateAddress, validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { markEmptyValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { discardInitialization } from '@src/store/payment/actionTypes';
import { AddressTypeIds } from '@src/components/pages/donation_form/AddressTypeIds';
import { ComputedRef, ref, Ref } from 'vue';

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
	addressType: ComputedRef<AddressTypeModel>,
	isDirectDebit: ComputedRef<boolean>,
	validateAddressUrl: string,
	validateEmailUrl: string,
): ReturnType {
	const submitValuesForm = ref<HTMLFormElement>();
	const submit = async (): Promise<void> => {
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

		// Track the form submission with the Matomo Form Analytics plugin
		// The form is a different one than the one for the submitValuesForm
		trackFormSubmissionForAddressType( addressType.value );
		submitValuesForm.value.submit();
	};

	const previousPage = async () => {
		await store.dispatch( action( NS_PAYMENT, discardInitialization ) );
		emit( 'previous-page' );
	};

	return {
		submit,
		previousPage,
		submitValuesForm,
	};
}
