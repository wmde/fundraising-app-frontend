<template>
	<RadioField
		v-model="addressType"
		id="address-form-type"
		name="addressTypeSelector"
		:options="[
			{ value: AddressTypeModel.PERSON, label: $t( 'C24_WMDE_Desktop_DE_01_contact_details_private' ), id: 'addressType-0' },
			{ value: AddressTypeModel.COMPANY_WITH_CONTACT, label: $t( 'C24_WMDE_Desktop_DE_01_contact_details_company' ), id: 'addressType-1' },
		]"
		:label="$t( 'C24_WMDE_Desktop_DE_01_contact_details_label' )"
		:show-error="showAddressTypeError"
		:error-message="$t( 'donation_form_section_address_error' )"
		:layout-type="'cluster'"
	/>

	<CheckboxField
		v-model="isCompany"
		name="is-company"
		id="address-form-is-company"
		input-id="is-company"
		:error-message="$t( 'donation_form_section_address_error' )"
		:show-error="showAddressTypeError"
	>
		<span>{{ $t( 'C24_WMDE_Desktop_DE_01_contact_details_label' ) }}</span>
	</CheckboxField>

	<TextField
		v-if="isCompany"
		name="companyName"
		id="address-form-company-name"
		input-id="company-name"
		v-model="formData.companyName.value"
		:show-error="showError.companyName"
		:error-message="$t( 'donation_form_companyname_error' )"
		autocomplete="organization"
		:label="$t( 'donation_form_companyname_label' )"
		:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_companyname_placeholder' ) } )"
		@field-changed="$emit('field-changed', 'companyName')"
	/>

	<div class="flex-field-group">
		<CountryAutocompleteField
			v-model="formData.country.value"
			id="address-form-country"
			input-id="country"
			scroll-target-id="address-form-country"
			:countries="countries"
			:was-restored="countryWasRestored"
			:show-error="showError.country"
			@field-changed="onCountryFieldChanged"
		/>

		<TextField
			name="postcode"
			id="address-form-post-code"
			class="flex-field-group__mini-field"
			input-id="post-code"
			v-model="formData.postcode.value"
			:show-error="showError.postcode"
			:error-message="$t('donation_form_zip_error')"
			autocomplete="postal-code"
			:label="$t( 'donation_form_zip_label' )"
			:placeholder="$t( 'donation_form_zip_placeholder' )"
			placeholder-warning="donation_form_zip_placeholder_warning"
			@field-changed="$emit('field-changed', 'postcode')"
		/>

		<CityAutocompleteField
			v-model="formData.city.value"
			id="address-form-city"
			input-id="city"
			scroll-target-id="address-form-city"
			:show-error="showError.city"
			:label="$t( 'donation_form_city_label' )"
			:error-message="$t( 'donation_form_city_error' )"
			:postcode="formData.postcode.value"
			@field-changed="$emit('field-changed', 'city' )"
		/>
	</div>

	<div class="flex-field-group">
		<StreetAutocompleteField
			id="address-form-street"
			input-id-street-name="street"
			input-id-building-number="building-number"
			:is-inline="true"
			scroll-target-id="address-form-street"
			v-model="formData.street.value"
			:postcode="formData.postcode.value"
			:show-error="showError.street"
			@field-changed="$emit('field-changed', 'street' )"
		/>
	</div>
</template>

<script setup lang="ts">

import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { useStore } from 'vuex';
import { useAddressTypeModel } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeModel';
import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed, onBeforeMount, ref } from 'vue';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import StreetAutocompleteField from '@src/components/shared/form_fields/StreetAutocompleteField.vue';
import type { Country } from '@src/view_models/Country';
import { Validity } from '@src/view_models/Validity';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';

interface Props {
	formData: AddressFormData;
	showError: AddressValidity;
	countries: Country[];
	postCodeValidation: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed' ] );

const store = useStore();
const addressType = useAddressTypeModel( store );

const showAddressTypeError = computed( () => store.getters[ 'address/addressTypeIsInvalid' ] );
const countryWasRestored = ref<boolean>( false );

const isCompany = ref<boolean>( false );

const onCountryFieldChanged = ( country: Country | undefined ) => {
	if ( country ) {
		props.formData.postcode.pattern = country.postCodeValidation;
	} else {
		props.formData.postcode.pattern = props.postCodeValidation;
	}

	emit( 'field-changed', 'country' );

	if ( props.formData.postcode.value !== '' ) {
		emit( 'field-changed', 'postcode' );
	}
};

onBeforeMount( () => {
	countryWasRestored.value = store.state.address.validity.country === Validity.RESTORED;
} );

</script>
