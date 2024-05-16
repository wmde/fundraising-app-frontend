<template>
	<div class="address-update-form">
		<h1>{{ $t( 'address_change_form_title' ) }}</h1>
		<p>{{ $t( 'address_change_form_label' ) }}</p>

		<form name="laika-address-update" ref="form" :action="updateAddressURL" method="post" @submit.prevent="submit">
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

			<submit-values :tracking-data="{}"></submit-values>

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
import { computed, onBeforeMount, ref } from 'vue';
import SubmitValues from '@src/components/pages/update_address/SubmitValues.vue';
import { AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { Country } from '@src/view_models/Country';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setAddressField, validateAddress } from '@src/store/address/actionTypes';
import { action } from '@src/store/util';
import { AddressValidation } from '@src/view_models/Validation';
import { useStore } from 'vuex';
import { trackFormSubmission } from '@src/util/tracking';
import { Salutation } from '@src/view_models/Salutation';
import NameFields from '@src/components/shared/NameFields.vue';
import PostalAddressFields from '@src/components/shared/PostalAddressFields.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { useReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

defineOptions( {
	name: 'UpdateAddress',
} );

interface Props {
	validateAddressUrl: string;
	updateAddressURL: string;
	isCompany: boolean;
	countries: Country[],
	salutations: Salutation[],
	addressValidationPatterns: AddressValidation,
}

const props = defineProps<Props>();
const store = useStore();
const form = ref<HTMLFormElement>( null );

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

const { addressType, setAddressType } = useAddressTypeFunctions( store );
const { receiptNeeded } = useReceiptModel( store );

const userOnlyWantsToDeclineReceipt = computed<boolean>( () => {
	return !store.state.address.receipt && store.getters[ NS_ADDRESS + '/allRequiredFieldsEmpty' ];
} );

const validateForm = (): Promise<ValidationResult> => {
	return store.dispatch( action( NS_ADDRESS, validateAddress ), props.validateAddressUrl );
};

const onFieldChange = ( fieldName: string ): void => {
	store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
};

const submit = (): void => {
	if ( userOnlyWantsToDeclineReceipt.value ) {
		trackFormSubmission( form.value );
		form.value.submit();
	}
	validateForm().then( ( validationResult: ValidationResult ) => {
		if ( validationResult.status === 'OK' ) {
			trackFormSubmission( form.value );
			form.value.submit();
		}
	} );
};

onBeforeMount( () => {
	setAddressType( props.isCompany ? AddressTypeModel.COMPANY : AddressTypeModel.PERSON );
} );

</script>
