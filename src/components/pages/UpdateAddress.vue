<template>
	<div class="address-update-form">
		<h1>{{ $t( 'address_change_form_title' ) }}</h1>
		<p>{{ $t( 'address_change_form_label' ) }}</p>

		<ErrorSummary
			:is-visible="showErrorSummary"
			:items="[
				{
					validity: store.state.address.validity.companyName,
					message: $t( 'donation_form_companyname_error' ),
					focusElement: 'company-name',
					scrollElement: 'company-name-scroll-target'
				},
				{
					validity: store.state.address.validity.salutation,
					message: $t( 'donation_form_salutation_error' ),
					focusElement: 'salutation-0',
					scrollElement: 'salutation-scroll-target'
				},
				{
					validity: store.state.address.validity.firstName,
					message: $t( 'donation_form_firstname_error' ),
					focusElement: 'first-name',
					scrollElement: 'first-name-scroll-target'
				},
				{
					validity: store.state.address.validity.lastName,
					message: $t( 'donation_form_lastname_error' ),
					focusElement: 'last-name',
					scrollElement: 'last-name-scroll-target'
				},
				{
					validity: store.state.address.validity.street,
					message: $t( 'donation_form_street_error' ),
					focusElement: 'street',
					scrollElement: 'street-scroll-target'
				},
				{
					validity: store.state.address.validity.postcode,
					message: $t( 'donation_form_zip_error' ),
					focusElement: 'post-code',
					scrollElement: 'post-code-scroll-target'
				},
				{
					validity: store.state.address.validity.city,
					message: $t( 'donation_form_city_error' ),
					focusElement: 'city',
					scrollElement: 'city-scroll-target'
				},
				{
					validity: store.state.address.validity.country,
					message: $t( 'donation_form_country_error' ),
					focusElement: 'country',
					scrollElement: 'country-scroll-target'
				},
			]"
		/>

		<form name="laika-address-update" ref="form" @submit.prevent="submit">
			<CheckboxField
				v-model="receiptNeeded"
				input-id="receipt-option-person"
				name="receipt-option"
			>
				{{ $t( 'receipt_needed_donation_page' ) }}<br/><br/>
				<em>{{ $t( 'address_change_opt_out_hint') }}</em>
			</CheckboxField>

			<NameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:salutations="salutations"
				:address-type="addressType"
				@field-changed="onFieldChange"
			/>

			<PostalAddressFields
				:show-error="fieldErrors"
				:form-data="formData"
				:countries="countries"
				:post-code-validation="addressValidationPatterns.postcode"
				:country-was-restored="false"
				v-on:field-changed="onFieldChange"
			/>

			<ServerMessage :server-message="serverErrorMessage"/>

			<SubmitValues />

			<div class="update-address-form-button">
				<FormButton
					id="next"
					button-type="submit"
					:is-loading="store.getters.isValidating"
				>
					{{ $t('address_change_form_submit') }}
				</FormButton>
			</div>
		</form>

	</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import SubmitValues from '@src/components/pages/update_address/SubmitValues.vue';
import type { Address, AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import type { Country } from '@src/view_models/Country';
import { action } from '@src/store/util';
import type { AddressValidation } from '@src/view_models/Validation';
import { useStore } from 'vuex';
import { trackFormSubmission } from '@src/util/tracking';
import type { Salutation } from '@src/view_models/Salutation';
import NameFields from '@src/components/shared/NameFields.vue';
import PostalAddressFields from '@src/components/shared/PostalAddressFields.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';
import { useAddressTypeFunctions } from '@src/components/shared/composables/useAddressTypeFunctions';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import ServerMessage from '@src/components/shared/ServerMessage.vue';
import { addressTypeName } from '@src/view_models/AddressTypeModel';
import type { UpdateAddressResponse } from '@src/api/UpdateAddressResponse';
import type { AddressChangeResource } from '@src/api/AddressChangeResource';
import { useReceiptModel } from '@src/components/shared/composables/useReceiptModel';

defineOptions( {
	name: 'UpdateAddress',
} );

interface Props {
	validateAddressUrl: string;
	countries: Country[];
	salutations: Salutation[];
	addressValidationPatterns: AddressValidation;
	addressChangeResource: AddressChangeResource;
}

const props = defineProps<Props>();
const store = useStore();
const form = ref<HTMLFormElement>( null );
const showErrorSummary = ref<boolean>( false );
const serverErrorMessage = ref<string>( '' );

const formData: AddressFormData = {
	salutation: {
		name: 'salutation',
		value: '',
		pattern: props.addressValidationPatterns.salutation,
		optionalField: false,
	},
	title: {
		name: 'title',
		value: '',
		pattern: props.addressValidationPatterns.title,
		optionalField: true,
	},
	companyName: {
		name: 'companyName',
		value: '',
		pattern: props.addressValidationPatterns.companyName,
		optionalField: false,
	},
	firstName: {
		name: 'firstName',
		value: '',
		pattern: props.addressValidationPatterns.firstName,
		optionalField: false,
	},
	lastName: {
		name: 'lastName',
		value: '',
		pattern: props.addressValidationPatterns.lastName,
		optionalField: false,
	},
	street: {
		name: 'street',
		value: '',
		pattern: props.addressValidationPatterns.street,
		optionalField: false,
	},
	city: {
		name: 'city',
		value: '',
		pattern: props.addressValidationPatterns.city,
		optionalField: false,
	},
	postcode: {
		name: 'postcode',
		value: '',
		pattern: props.addressValidationPatterns.postcode,
		optionalField: false,
	},
	country: {
		name: 'country',
		value: 'DE',
		pattern: props.addressValidationPatterns.country,
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

const { addressType } = useAddressTypeFunctions( store );
const { receiptNeeded } = useReceiptModel( store );

const userOnlyWantsToDeclineReceipt = computed<boolean>( () => {
	return !store.state.address.receipt && store.getters[ 'address/allRequiredFieldsEmpty' ];
} );

const validateForm = (): Promise<ValidationResult> => {
	return store.dispatch( action( 'address', 'validateAddress' ), props.validateAddressUrl );
};

const onFieldChange = ( fieldName: string ): void => {
	store.dispatch( action( 'address', 'setAddressField' ), formData[ fieldName ] );
};

const getAddressData = (): Address => {
	const data = {
		addressType: addressTypeName( store.getters[ 'address/addressType' ] ),
	} as any;
	Object.keys( formData ).forEach( fieldName => {
		data[ fieldName ] = formData[ fieldName ].value;
	} );
	return data as Address;
};

const submit = (): void => {
	showErrorSummary.value = false;
	serverErrorMessage.value = '';

	if ( userOnlyWantsToDeclineReceipt.value ) {
		trackFormSubmission( form.value );
		form.value.submit();
	}
	validateForm().then( ( validationResult: ValidationResult ) => {
		if ( validationResult.status === 'OK' ) {
			trackFormSubmission( form.value );
			props.addressChangeResource.put( getAddressData() ).then( ( addressData: UpdateAddressResponse ) => {
				window.location.href = '/update-address/success?addressToken=' + addressData.identifier;
			} ).catch( ( error: string ) => {
				serverErrorMessage.value = error;
			} );
		} else {
			showErrorSummary.value = true;
		}
	} );
};

store.watch( ( state, getters ) => getters[ 'address/requiredFieldsAreValid' ], ( isValid: boolean ) => {
	if ( showErrorSummary.value && isValid ) {
		showErrorSummary.value = false;
	}
} );

</script>
