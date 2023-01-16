<template>
<div>
	<div v-bind:class="['form-input', { 'is-invalid': showError.street, 'is-warning': showWarning }]">
		<label for="street" class="subtitle">{{ $t( 'donation_form_street_label' ) }}</label>
		<b-field :type="{ 'is-danger': showError.street, 'is-warning': showWarning && !showError.street }">
			<b-input type="text"
					id="street"
					:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_placeholder' ) } )"
					autocomplete="street-address"
					v-model="formData.street.value"
					@blur="$emit('field-changed', 'street'); displayStreetWarning()">
			</b-input>
		</b-field>
		<span v-if="showError.street" class="help is-danger error-street">{{ $t('donation_form_street_error') }}</span>
		<span v-if="showWarning" class="help">{{ $t('donation_form_street_number_warning') }}</span>
		<span v-if="streetValueEqualsPlaceholder" class="help">{{ $t('donation_form_street_placeholder_warning') }}</span>
	</div>
	<div v-bind:class="['form-input', { 'is-invalid': showError.postcode }]">
		<label for="post-code" class="subtitle">{{ $t( 'donation_form_zip_label' ) }}</label>
		<b-field :type="{ 'is-danger': showError.postcode }">
			<b-input type="text"
					id="post-code"
					v-model="formData.postcode.value"
					:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_zip_placeholder' ) } )"
					autocomplete="postal-code"
					@blur="$emit('field-changed', 'postcode')">
			</b-input>
		</b-field>
		<span v-if="showError.postcode" class="help is-danger error-postcode">{{ $t('donation_form_zip_error') }}</span>
		<span v-if="zipValueEqualsPlaceholder" class="help">{{ $t('donation_form_zip_placeholder_warning') }}</span>
	</div>
	<div v-bind:class="['form-input', { 'is-invalid': showError.city }]">
		<label for="city" class="subtitle">{{ $t( 'donation_form_city_label' ) }}</label>
		<b-field :type="{ 'is-danger': showError.city }">
			<AutocompleteCity
				:city="formData.city"
				:example-placeholder="'donation_form_city_placeholder'"
				:show-error="showError.city"
				:postcode="formData.postcode.value"
				v-on:field-changed="$emit('field-changed', 'city')"
			/>
		</b-field>
		<span v-if="showError.city" class="help is-danger error-city">{{ $t('donation_form_city_error') }}</span>
		<span v-if="cityValueEqualsPlaceholder" class="help">{{ $t('donation_form_city_placeholder_warning') }}</span>
	</div>

	<div v-bind:class="['form-input', { 'is-invalid': showError.country }]">
		<label for="country" class="subtitle">{{ $t( 'donation_form_country_label' ) }}</label>
		<b-field :type="{ 'is-danger': showError.country }">
			<b-autocomplete
					class="is-form-input"
					field="countryFullName"
					:placeholder="$t( 'form_for_example', { example: countries[0].countryFullName } )"
					v-model="countryInput"
					name="country"
					id="country"
					group-field="group"
					:keep-first="keepFirst"
					:open-on-focus="openOnFocus"
					:data="filteredCountries"
					@focus="focusCountryField"
					@input="changeCountry">
				<span slot="group"><hr></span>
			</b-autocomplete>
		</b-field>
		<span v-if="showError.country" class="help is-danger error-country">{{ $t('donation_form_country_error') }}</span>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { AddressValidity, AddressFormData } from '@/view_models/Address';
import { Country } from '@/view_models/Country';
import AutocompleteCity from '@/components/shared/AutocompleteCity.vue';

export default Vue.extend( {
	name: 'postal',
	props: {
		showError: Object as () => AddressValidity,
		formData: Object as () => AddressFormData,
		countries: Array as () => Array<Country>,
		postCodeValidation: String,
	},
	components: { AutocompleteCity },
	data() {
		return {
			showWarning: false,
			keepFirst: true,
			openOnFocus: true,
			countryInput: 'Deutschland',
			countryClicked: false,
		};
	},
	mounted() {
		const country = this.getCountryFromCode( this.$props.formData.country.value );
		if ( country && this.countryInput !== country.countryFullName ) {
			this.countryInput = country.countryFullName;
			if ( this.$props.formData.postcode.value !== '' ) {
				this.setPostcodeValidation( country.postCodeValidation );
			}
		}
	},
	watch: {
		'formData.country.value': function ( value ) {
			const country = this.getCountryFromCode( value );
			if ( country ) {
				this.setPostcodeValidation( country.postCodeValidation );
			}
		},
	},
	methods: {
		displayStreetWarning() {
			this.showWarning = /^\D+$/.test( this.formData.street.value );
		},
		getCountryFromCode( countryCode: string ) {
			const country = this.countries.find( ( c: Country ) => c.countryCode === countryCode );
			if ( country !== undefined ) {
				return country;
			}
			return null;
		},
		setPostcodeValidation( pattern: string ) {
			this.$props.formData.postcode.pattern = pattern;
			this.$emit( 'field-changed', 'postcode' );
		},
		focusCountryField() {
			if ( !this.$data.countryClicked ) {
				this.formData.country.value = '';
				this.$data.countryInput = '';
			}
		},
		changeCountry( option: String ) {
			let country = this.$props.countries.find( ( c: Country ) => c.countryFullName === option );
			this.formData.postcode.pattern = this.$props.postCodeValidation;
			if ( country ) {
				if ( country.postCodeValidation !== '' ) {
					this.formData.postcode.pattern = country.postCodeValidation;
				}
				this.formData.country.value = country.countryCode;
			} else {
				this.formData.country.value = '';
			}
			// If the country value is default only emit an event after the first interaction
			// This stops the field being marked as invalid when the user clicks it
			if ( this.$data.countryClicked ) {
				this.$emit( 'field-changed', 'country' );
			} else {
				this.$data.countryClicked = true;
			}
		},
	},
	computed: {
		streetValueEqualsPlaceholder(): boolean {
			return this.$props.formData.street.value === this.$t( 'donation_form_street_placeholder' );
		},
		cityValueEqualsPlaceholder(): boolean {
			return this.$props.formData.city.value === this.$t( 'donation_form_city_placeholder' );
		},
		zipValueEqualsPlaceholder(): boolean {
			return this.$props.formData.postcode.value === this.$t( 'donation_form_zip_placeholder' );
		},

		filteredCountries(): Array<Country> {
			const filteredCountries = this.countries.filter( ( countryOption: Country ) => {
				return countryOption.countryFullName
					.toString()
					.toLowerCase()
					.indexOf( this.$data.countryInput.toLowerCase() ) >= 0;
			} );

			return filteredCountries.length > 0 ? filteredCountries : this.countries;
		},
	},
} );
</script>
