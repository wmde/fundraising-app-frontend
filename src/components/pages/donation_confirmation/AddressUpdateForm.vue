<template>
	<form id="address-update-form" class="flow compact" name="address-update-form" v-on:submit.prevent="submit" method="post" ref="addressForm">
		<AddressUpdateFormErrorSummaries :show-error-summary="showErrorSummary"/>

		<AutofillHandler v-on:autofill="onAutofill">

			<NameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:salutations="salutations"
				@field-changed="onFieldChange"
			/>

			<EmailField
				:show-error="fieldErrors.email"
				v-model="formData.email.value"
				@field-changed="onFieldChange"
			/>

			<AddressFields
				:show-error="fieldErrors"
				:form-data="formData"
				:countries="countries"
				:post-code-validation="addressValidationPatterns.postcode"
				:split-street="false"
				@field-changed="onFieldChange"
			/>

			<MailingListField v-model="mailingList" input-id="newsletter"/>

		</AutofillHandler>

		<div class="switcher">
			<FormButton
				id="previous-btn"
				:is-outlined="true"
				@click="$emit( 'close' )"
			>
				{{ $t( 'donation_confirmation_address_update_cancel' ) }}
			</FormButton>
			<FormButton
				id="submit-btn"
				:is-loading="isValidating"
				button-type="submit"
			>
				{{ $t( 'donation_confirmation_address_update_confirm' ) }}
			</FormButton>
		</div>

		<ServerMessage :server-message="serverErrorMessage"/>

	</form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import type { Address, AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { action } from '@src/store/util';
import { mergeValidationResults } from '@src/util/merge_validation_results';
import { camelizeName } from '@src/util/camlize_name';
import type { Country } from '@src/view_models/Country';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import type { DonorResource } from '@src/api/DonorResource';
import { useStore } from 'vuex';
import type { Donation } from '@src/view_models/Donation';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import NameFields from '@src/components/pages/donation_form/PersonalData/NameFields.vue';
import AddressFields from '@src/components/pages/donation_form/PersonalData/AddressFields.vue';
import AddressUpdateFormErrorSummaries from '@src/components/pages/donation_confirmation/AddressUpdateFormErrorSummaries.vue';
import type { UpdateDonorRequest } from '@src/api/UpdateDonorRequest';
import ServerMessage from '@src/components/shared/ServerMessage.vue';
import { useMailingListModel } from '@src/components/shared/composables/useMailingListModel';

interface Props {
	addressValidationPatterns: AddressValidation;
	countries: Country[];
	donation: Donation;
	donorResource: DonorResource;
	salutations: Salutation[];
	validateAddressUrl: String;
	validateEmailUrl: String;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'address-updated', 'close' ] );
const store = useStore();

const addressForm = ref<HTMLFormElement>( null );
const isValidating = ref<boolean>( false );
const serverErrorMessage = ref<string>( '' );
const showErrorSummary = ref<boolean>( false );
const formData: AddressFormData = {
	salutation: {
		name: 'salutation',
		value: store.state.address.values.salutation,
		pattern: props.addressValidationPatterns.salutation,
		optionalField: false,
	},
	title: {
		name: 'title',
		value: store.state.address.values.title,
		pattern: props.addressValidationPatterns.title,
		optionalField: true,
	},
	companyName: {
		name: 'companyName',
		value: store.state.address.values.companyName,
		pattern: props.addressValidationPatterns.companyName,
		optionalField: false,
	},
	firstName: {
		name: 'firstName',
		value: store.state.address.values.firstName,
		pattern: props.addressValidationPatterns.firstName,
		optionalField: false,
	},
	lastName: {
		name: 'lastName',
		value: store.state.address.values.lastName,
		pattern: props.addressValidationPatterns.lastName,
		optionalField: false,
	},
	street: {
		name: 'street',
		value: store.state.address.values.street,
		pattern: props.addressValidationPatterns.street,
		optionalField: false,
	},
	city: {
		name: 'city',
		value: store.state.address.values.city,
		pattern: props.addressValidationPatterns.city,
		optionalField: false,
	},
	postcode: {
		name: 'postcode',
		value: store.state.address.values.postcode,
		pattern: props.addressValidationPatterns.postcode,
		optionalField: false,
	},
	country: {
		name: 'country',
		value: store.state.address.values.country,
		pattern: props.addressValidationPatterns.country,
		optionalField: false,
	},
	email: {
		name: 'email',
		value: store.state.address.values.email,
		pattern: props.addressValidationPatterns.email,
		optionalField: false,
	},
};

const fieldErrors = computed<AddressValidity>( () => {
	return Object.keys( formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
		if ( !formData[ fieldName ].optionalField ) {
			validity[ fieldName ] = store.state.address.validity[ fieldName ] === Validity.INVALID;
		}
		return validity;
	}, ( {} as AddressValidity ) );
} );

const mailingList = useMailingListModel( store );

const validateForm = async (): Promise<ValidationResult> => {
	const results = await Promise.all( [
		store.dispatch( action( 'address', 'validateAddress' ), props.validateAddressUrl ),
		store.dispatch( action( 'address', 'validateEmail' ), props.validateEmailUrl ),
	] );
	return mergeValidationResults( results );
};

const onFieldChange = ( fieldName: string ): void => {
	store.dispatch( action( 'address', 'setAndValidateAddressField' ), formData[ fieldName ] );
};

const onAutofill = ( autofilledFields: { [key: string]: string } ) => {
	Object.keys( autofilledFields ).forEach( key => {
		const fieldName = camelizeName( key );
		if ( formData[ fieldName ] ) {
			store.dispatch( action( 'address', 'setAndValidateAddressField' ), formData[ fieldName ] );
		}
	} );
};

const getAddressData = (): UpdateDonorRequest => {
	return {
		donationId: props.donation.id,
		updateToken: props.donation.updateToken,
		addressType: store.getters[ 'address/addressType' ],
		city: formData.city.value,
		companyName: formData.companyName.value,
		country: formData.country.value,
		email: formData.email.value,
		firstName: formData.firstName.value,
		lastName: formData.lastName.value,
		postcode: formData.postcode.value,
		salutation: formData.salutation.value,
		street: formData.street.value,
		title: formData.title.value,
		mailingList: store.state.address.newsletter,
	};
};

const submit = async (): Promise<void> => {
	isValidating.value = true;
	serverErrorMessage.value = '';
	showErrorSummary.value = false;

	const validationResult = await validateForm();

	if ( validationResult.status !== 'OK' ) {
		isValidating.value = false;
		showErrorSummary.value = true;
		return;
	}

	props.donorResource.put( getAddressData() ).then( ( addressData: Address ) => {
		isValidating.value = false;
		emit( 'address-updated', { addressData, addressType: addressData.addressType } );
	} ).catch( ( error: string ) => {
		isValidating.value = false;
		serverErrorMessage.value = error;
	} );
};

store.watch( ( state, getters ) => getters[ 'address/requiredFieldsAreValid' ], ( isValid: boolean ) => {
	if ( showErrorSummary.value && isValid ) {
		showErrorSummary.value = false;
	}
} );

onMounted( () => {
	Object.entries( formData ).forEach( ( formItem ) => {
		const key: string = formItem[ 0 ];
		if ( formData[ key ].value !== '' ) {
			store.dispatch( action( 'address', 'validateAddressField' ), formData[ key ] );
		}
	} );

	store.dispatch( action( 'address', 'setIsAnonymous' ), false );
	store.dispatch( action( 'address', 'setReceiptChoice' ), true );
} );

</script>
