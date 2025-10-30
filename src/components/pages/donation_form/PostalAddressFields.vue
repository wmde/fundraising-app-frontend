<template>
	<CountryAutocompleteField
		v-model="formData.country.value"
		:id="`${fieldIdNamespace}address-form-country`"
		:input-id="`${fieldIdNamespace}country`"
		:scroll-target-id="`${fieldIdNamespace}address-form-country`"
		:countries="countries"
		:was-restored="countryWasRestored"
		:show-error="showError.country"
		:is-max-width-field="true"
		@field-changed="onCountryFieldChanged"
	/>

	<TextField
		name="postcode"
		:id="`${fieldIdNamespace}address-form-post-code`"
		:input-id="`${fieldIdNamespace}post-code`"
		v-model="formData.postcode.value"
		:show-error="showError.postcode"
		:error-message="$t('donation_form_zip_error')"
		autocomplete="postal-code"
		:label="$t( 'donation_form_zip_label' )"
		:placeholder="$t( 'donation_form_zip_placeholder' )"
		placeholder-warning="donation_form_zip_placeholder_warning"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'postcode')"
	/>

	<CityAutocompleteField
		v-model="formData.city.value"
		:id="`${fieldIdNamespace}address-form-city`"
		:input-id="`${fieldIdNamespace}city`"
		:scroll-target-id="`${fieldIdNamespace}address-form-city`"
		:show-error="showError.city"
		:label="$t( 'donation_form_city_label' )"
		:error-message="$t( 'donation_form_city_error' )"
		:postcode="formData.postcode.value"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'city' )"
	/>

	<StreetAutocompleteField
		:id="`${fieldIdNamespace}address-form-street`"
		:input-id-street-name="`${fieldIdNamespace}street`"
		:input-id-building-number="`${fieldIdNamespace}building-number`"
		:scroll-target-id="`${fieldIdNamespace}address-form-street`"
		v-model="formData.street.value"
		:postcode="formData.postcode.value"
		:show-error="showError.street"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'street' )"
	/>
</template>

<script setup lang="ts">

import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import type { Country } from '@src/view_models/Country';
import StreetAutocompleteField from '@src/components/shared/form_fields/StreetAutocompleteField.vue';

interface Props {
	formData: AddressFormData;
	showError: AddressValidity;
	countries: Country[];
	postCodeValidation: string;
	countryWasRestored: boolean;
	fieldIdNamespace?: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed' ] );

const fieldIdNamespace = props.fieldIdNamespace ? `${props.fieldIdNamespace}-` : '';

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

</script>
