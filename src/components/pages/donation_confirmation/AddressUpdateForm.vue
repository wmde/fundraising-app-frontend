<template>
	<form id="address-update-form" name="address-update-form" v-on:submit.prevent="submit" method="post" ref="addressForm">
		<AutofillHandler v-on:autofill="onAutofill">

			<RadioField
				name="addressType"
				class="address-type-field"
				:options="[
					{
						value: AddressTypeModel.PERSON,
						label: $t( 'donation_form_addresstype_option_private_addresstype_basic' ),
					},
					{
						value: AddressTypeModel.COMPANY,
						label: $t( 'donation_form_addresstype_option_company_addresstype_basic' ),
					}
				]"
				:label="$t( 'donation_form_address_choice_title_addresstype_basic' )"
				:show-error="addressTypeIsInvalid"
				:error-message="$t( 'donation_form_section_address_error' )"
				v-model="addressTypeModel"
				alignment="column"
			/>

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

			<EmailField
				:show-error="fieldErrors.email"
				v-model="formData.email.value"
				@field-changed="onFieldChange"
			>
				<template #message>
					<ValueEqualsPlaceholderWarning
						:value="formData.email.value"
						:placeholder="$t( 'donation_form_email_placeholder_vuei18n_v3' )"
						warning="donation_form_email_placeholder_warning"
					/>
				</template>
			</EmailField>

		</AutofillHandler>

		<MailingListField v-model="mailingList"/>

		<FormSummary :show-border="false">
			<template #summary-buttons>
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
			</template>
		</FormSummary>

		<div v-if="serverMessage !== ''" class="columns error-server">
			<div class="column has-text-danger has-text-centered has-text-weight-bold">
				{{ $t( serverMessage ) }}
			</div>
		</div>

	</form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import { Address, AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setAddressField, validateAddress, validateAddressField, validateAddressType, validateEmail } from '@src/store/address/actionTypes';
import { action } from '@src/store/util';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import { mergeValidationResults } from '@src/util/merge_validation_results';
import { camelizeName } from '@src/util/camlize_name';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import DonorResource from '@src/api/DonorResource';
import { useStore } from 'vuex';
import { Donation } from '@src/view_models/Donation';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import NameFields from '@src/components/shared/NameFields.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import PostalAddressFields from '@src/components/shared/PostalAddressFields.vue';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import scrollToFirstError from '@src/util/scroll_to_first_error';

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
const emit = defineEmits( [ 'address-updated' ] );
const store = useStore();

const addressForm = ref<HTMLFormElement>( null );
const isValidating = ref<boolean>( false );
const serverMessage = ref<string>( '' );
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

// TODO: Refactor useAddressTypeFunctions so it returns a model that it watches internally.
//       Currently it is not very reusable and doesn't integrate well with the new fields
const { addressType, addressTypeIsInvalid, setAddressType } = useAddressTypeFunctions( store );
const addressTypeModel = ref<AddressTypeModel>( addressType.value );
watch( addressTypeModel, ( newAddressType: AddressTypeModel ) => setAddressType( newAddressType ) );

const mailingList = useMailingListModel( store );

const validateForm = async (): Promise<ValidationResult> => {
	let response = await store.dispatch( action( NS_ADDRESS, validateAddressType ), {
		type: store.state.address.addressType,
		disallowed: [ AddressTypeModel.UNSET, AddressTypeModel.ANON ],
	} );
	if ( response.status !== 'OK' ) {
		return Promise.resolve( response );
	}
	let results = await Promise.all( [
		store.dispatch( action( NS_ADDRESS, validateAddress ), props.validateAddressUrl ),
		store.dispatch( action( NS_ADDRESS, validateEmail ), props.validateEmailUrl ),
	] );
	return mergeValidationResults( results );
};

const onFieldChange = ( fieldName: string ): void => {
	store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
};

const onAutofill = ( autofilledFields: { [key: string]: string; } ) => {
	Object.keys( autofilledFields ).forEach( key => {
		const fieldName = camelizeName( key );
		if ( formData[ fieldName ] ) {
			store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
		}
	} );
};

const getAddressData = (): Address => {
	const data = {
		updateToken: props.donation.updateToken,
		donationId: props.donation.id,
		addressType: addressTypeName( store.getters[ NS_ADDRESS + '/addressType' ] ),
	} as any;
	Object.keys( formData ).forEach( fieldName => {
		data[ fieldName ] = formData[ fieldName ].value;
	} );
	return data as Address;
};

const submit = async (): Promise<void> => {
	isValidating.value = true;
	serverMessage.value = '';

	const validationResult = await validateForm();

	if ( validationResult.status !== 'OK' ) {
		isValidating.value = false;
		scrollToFirstError();
		return;
	}

	trackFormSubmission( addressForm.value );

	props.donorResource.put( getAddressData() ).then( ( addressData: Address ) => {
		isValidating.value = false;
		emit( 'address-updated', { addressData, addressType: addressData.addressType } );
	} ).catch( ( error: string ) => {
		isValidating.value = false;
		serverMessage.value = error;
	} );
};

onMounted( () => {
	trackDynamicForm();

	Object.entries( formData ).forEach( ( formItem ) => {
		const key: string = formItem[ 0 ];
		if ( formData[ key ].value !== '' ) {
			store.dispatch( action( NS_ADDRESS, validateAddressField ), formData[ key ] );
		}
	} );
} );

</script>
