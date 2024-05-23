<template>
	<div class="address-section">

		<TextField
			name="street"
			:input-id="`${fieldIdNamespace}street`"
			v-model="formData.street.value"
			:show-error="showError.street"
			:error-message="$t('donation_form_street_error')"
			autocomplete="street-address"
			:label="$t( 'donation_form_street_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'street')"
		>
			<template #message>
				<span
					v-if="showStreetWarning"
					class="street-number-warning help"
				>{{ $t( 'donation_form_street_number_warning' ) }}</span>
				<ValueEqualsPlaceholderWarning
					:value="formData.street.value"
					:placeholder="$t( 'donation_form_street_placeholder' )"
					:warning="'donation_form_street_placeholder_warning'"
				/>
			</template>
		</TextField>

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

		<CityAutocompleteField
			v-model="formData.city.value"
			:input-id="`${fieldIdNamespace}city`"
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

	</div>
</template>

<script setup lang="ts">

import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { computed } from 'vue';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import { Country } from '@src/view_models/Country';

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

const showStreetWarning = computed<boolean>( () => /^\D+$/.test( props.formData.street.value ) );
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
