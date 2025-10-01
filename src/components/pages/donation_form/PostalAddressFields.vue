<template>
	<div class="address-section">

		<CountryAutocompleteField
			v-model="formData.country.value"
			:id="`${fieldIdNamespace}address-form-country`"
			:input-id="`${fieldIdNamespace}country`"
			:scroll-target-id="`${fieldIdNamespace}address-form-country`"
			:countries="countries"
			:was-restored="countryWasRestored"
			:show-error="showError.country"
			:error-message="$t('donation_form_country_error')"
			:label="$t( 'donation_form_country_label' )"
			:placeholder="$t( 'form_for_example', { example: countries[0].countryFullName } )"
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
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_zip_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'postcode')"
		>
			<template #message>
				<ValueEqualsPlaceholderWarning
					:value="formData.postcode.value"
					:placeholder="$t( 'donation_form_zip_placeholder' )"
					:warning="'donation_form_zip_placeholder_warning'"
				/>
			</template>
		</TextField>

		<CityAutocompleteField
			v-model="formData.city.value"
			:id="`${fieldIdNamespace}address-form-city`"
			:input-id="`${fieldIdNamespace}city`"
			:scroll-target-id="`${fieldIdNamespace}address-form-city`"
			:show-error="showError.city"
			:label="$t( 'donation_form_city_label' )"
			:error-message="$t( 'donation_form_city_error' )"
			:postcode="formData.postcode.value"
			example-placeholder="donation_form_city_placeholder"
			@field-changed="$emit('field-changed', 'city' )"
		>
			<template #message>
				<ValueEqualsPlaceholderWarning
					:value="formData.city.value"
					:placeholder="$t( 'donation_form_city_placeholder' )"
					warning="donation_form_city_placeholder_warning"
				/>
			</template>
		</CityAutocompleteField>

		<StreetAutocompleteField
			:id="`${fieldIdNamespace}address-form-street`"
			:input-id-street-name="`${fieldIdNamespace}street`"
			:input-id-building-number="`${fieldIdNamespace}building-number`"
			:scroll-target-id="`${fieldIdNamespace}address-form-street`"
			v-model="formData.street.value"
			:postcode="formData.postcode.value"
			:show-error="showError.street"
			:error-message="$t( 'donation_form_street_error' )"
			@field-changed="$emit('field-changed', 'street' )"
		/>
	</div>
</template>

<script setup lang="ts">

import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
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

<style lang="scss">

</style>
