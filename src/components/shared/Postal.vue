<template>
<div>
	<div v-bind:class="['form-input', { 'is-invalid': showError.street, 'is-warning': showWarning }]">
		<label for="street" class="subtitle">{{ $t( 'donation_form_street_label' ) }}</label>
		<div class="field">
			<TextInput
				input-id="street"
				name="street"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_placeholder' ) } )"
				autocomplete="street-address"
				v-model="formData.street.value"
				:has-error="showError.street"
				:has-message="showWarning && !showError.street"
				@blur="$emit('field-changed', 'street'); displayStreetWarning()"
			/>
		</div>
		<span v-if="showError.street" class="help is-danger error-street">{{ $t('donation_form_street_error') }}</span>
		<span v-if="showWarning" class="help">{{ $t('donation_form_street_number_warning') }}</span>
		<ValueEqualsPlaceholderWarning
			:value="formData.street.value"
			:placeholder="$t( 'donation_form_street_placeholder' )"
			:warning="'donation_form_street_placeholder_warning'"
		/>
	</div>
	<div v-bind:class="['form-input', { 'is-invalid': showError.postcode }]">
		<label for="post-code" class="subtitle">{{ $t( 'donation_form_zip_label' ) }}</label>
		<div class="field">
			<TextInput
				input-id="post-code"
				name="zip"
				v-model="formData.postcode.value"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_zip_placeholder' ) } )"
				:has-error="showError.postcode"
				autocomplete="postal-code"
				@blur="$emit('field-changed', 'postcode')"
			/>
		</div>
		<span v-if="showError.postcode" class="help is-danger error-postcode">{{ $t('donation_form_zip_error') }}</span>
		<ValueEqualsPlaceholderWarning
			:value="formData.postcode.value"
			:placeholder="$t( 'donation_form_zip_placeholder' )"
			:warning="'donation_form_zip_placeholder_warning'"
		/>
	</div>
	<div v-bind:class="['form-input', { 'is-invalid': showError.city }]">
		<label for="city" class="subtitle">{{ $t( 'donation_form_city_label' ) }}</label>
		<div class="field" :class="{ 'is-danger': showError.city }">
			<AutocompleteCity
				v-model="formData.city.value"
				example-placeholder="donation_form_city_placeholder"
				:has-error="showError.city"
				:postcode="formData.postcode.value"
				@field-changed="$emit('field-changed', 'city')"
			/>
		</div>
		<span v-if="showError.city" class="help is-danger error-city">{{ $t('donation_form_city_error') }}</span>
		<ValueEqualsPlaceholderWarning
			:value="formData.city.value"
			:placeholder="$t( 'donation_form_city_placeholder' )"
			:warning="'donation_form_city_placeholder_warning'"
		/>
	</div>

	<div v-bind:class="['form-input', { 'is-invalid': showError.country }]">
		<label for="country" class="subtitle">{{ $t( 'donation_form_country_label' ) }}</label>
		<div class="field" :class="{ 'is-danger': showError.country }">
			<AutocompleteCountry
				:countries="countries"
				:has-error="showError.country"
				v-model="country"
				:initial-country-code="formData.country.value"
				:placeholder="$t( 'form_for_example', { example: countries[0].countryFullName } ).toString()"
				@field-changed="$emit('field-changed', 'country')"
				@initialised="initialiseCountry"
			/>
		</div>
		<span v-if="showError.country" class="help is-danger error-country">{{ $t('donation_form_country_error') }}</span>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import { Country } from '@src/view_models/Country';
import AutocompleteCity from '@src/components/shared/form_inputs/AutocompleteCity.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import TextInput from '@src/components/shared/form_inputs/TextInput.vue';
import AutocompleteCountry from '@src/components/shared/form_inputs/AutocompleteCountry.vue';

export default defineComponent( {
	name: 'postal',
	props: {
		showError: Object as () => AddressValidity,
		formData: Object as () => AddressFormData,
		countries: Array as () => Array<Country>,
		postCodeValidation: String,
	},
	components: { AutocompleteCountry, TextInput, ValueEqualsPlaceholderWarning, AutocompleteCity },
	data() {
		return {
			showWarning: false,
			country: undefined,
		};
	},
	watch: {
		country: function ( newCountry: Country|undefined ) {
			this.setCountry( newCountry );
			this.$emit( 'field-changed', 'country' );
			this.$emit( 'field-changed', 'postcode' );
		},
	},
	methods: {
		initialiseCountry( newCountry: Country|undefined ) {
			this.setCountry( newCountry );
			this.$emit( 'field-changed', 'country' );
		},
		setCountry( newCountry: Country|undefined ) {
			if ( newCountry ) {
				this.$props.formData.country.value = newCountry.countryCode;
				this.$props.formData.postcode.pattern = newCountry.postCodeValidation;
			} else {
				this.$props.formData.country.value = '';
				this.$props.formData.postcode.pattern = this.$props.postCodeValidation;
			}
		},
		displayStreetWarning() {
			this.showWarning = /^\D+$/.test( this.formData.street.value );
		},
	},
} );
</script>
