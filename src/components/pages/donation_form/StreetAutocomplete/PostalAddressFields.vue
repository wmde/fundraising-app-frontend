<template>
	<div class="address-section">

		<ScrollTarget :target-id="`${fieldIdNamespace}country-scroll-target`"/>
		<CountryAutocompleteField
			v-model="formData.country.value"
			:input-id="`${fieldIdNamespace}country`"
			:countries="countries"
			:was-restored="countryWasRestored"
			:show-error="showError.country"
			:error-message="$t('donation_form_country_error')"
			:label="$t( 'donation_form_country_label' )"
			:placeholder="$t( 'form_for_example', { example: countries[0].countryFullName } )"
			@field-changed="onCountryFieldChanged"
		/>

		<ScrollTarget :target-id="`${fieldIdNamespace}post-code-scroll-target`"/>
		<TextField
			name="postcode"
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

		<ScrollTarget :target-id="`${fieldIdNamespace}city-scroll-target`"/>
		<CityAutocompleteField
			v-model="formData.city.value"
			:input-id="`${fieldIdNamespace}city`"
			:scroll-target-id="`${fieldIdNamespace}city-scroll-target`"
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

		<ScrollTarget :target-id="`${fieldIdNamespace}street-scroll-target`"/>
		<StreetAutocompleteField
			:input-id-street-name="`${fieldIdNamespace}street`"
			:input-id-building-number="`${fieldIdNamespace}building-number`"
			:scroll-target-id="`${fieldIdNamespace}street-scroll-target`"
			v-model="formData.street.value"
			:postcode="formData.postcode.value"
			:show-error="showError.street"
			:error-message="$t( 'donation_form_street_error' )"
			@field-changed="$emit('field-changed', 'street' )"
		/>
	</div>
</template>

<script setup lang="ts">

import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import { Country } from '@src/view_models/Country';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
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
