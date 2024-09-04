<template>
	<div class="address-section">

		<ScrollTarget target-id="address-type-scroll-target"/>
		<RadioField
			v-model="addressType"
			name="addressTypeSelector"
			:options="[
				{ value: AddressTypeModel.PERSON, label: $t( 'C24_WMDE_Desktop_DE_01_contact_details_private' ), id: 'addressType-0' },
				{ value: AddressTypeModel.COMPANY_WITH_CONTACT, label: $t( 'C24_WMDE_Desktop_DE_01_contact_details_company' ), id: 'addressType-1' },
			]"
			:label="$t( 'C24_WMDE_Desktop_DE_01_contact_details_label' )"
			:show-error="showAddressTypeError"
			:error-message="$t( 'donation_form_section_address_error' )"
			alignment="row"
		/>

		<ScrollTarget target-id="company-name-scroll-target"/>
		<TextField
			v-if="addressType === AddressTypeModel.COMPANY_WITH_CONTACT"
			name="companyName"
			input-id="company-name"
			v-model="formData.companyName.value"
			:show-error="showError.companyName"
			:error-message="$t( 'donation_form_companyname_error' )"
			autocomplete="organization"
			:label="$t( 'donation_form_companyname_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_companyname_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'companyName')"
		/>

		<ScrollTarget target-id="street-scroll-target"/>
		<TextField
			name="street"
			input-id="street"
			v-model="formData.street.value"
			:show-error="showError.street"
			:error-message="$t('donation_form_street_error')"
			autocomplete="street-address"
			:label="$t( 'donation_form_street_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_street_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'street')"
		>
			<span v-if="showStreetWarning" class="help">{{ $t('donation_form_street_number_warning') }}</span>
			<ValueEqualsPlaceholderWarning
				:value="formData.street.value"
				:placeholder="$t( 'donation_form_street_placeholder' )"
				:warning="'donation_form_street_placeholder_warning'"
			/>
		</TextField>

		<ScrollTarget target-id="post-code-scroll-target"/>
		<TextField
			name="postcode"
			input-id="post-code"
			v-model="formData.postcode.value"
			:show-error="showError.postcode"
			:error-message="$t('donation_form_zip_error')"
			autocomplete="postal-code"
			:label="$t( 'donation_form_zip_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_zip_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'postcode')"
		>
			<ValueEqualsPlaceholderWarning
				:value="formData.postcode.value"
				:placeholder="$t( 'donation_form_zip_placeholder' )"
				:warning="'donation_form_zip_placeholder_warning'"
			/>
		</TextField>

		<ScrollTarget target-id="city-scroll-target"/>
		<CityAutocompleteField
			v-model="formData.city.value"
			input-id="city"
			scroll-target-id="city-scroll-target"
			:show-error="showError.city"
			:label="$t( 'donation_form_city_label' )"
			:error-message="$t( 'donation_form_city_error' )"
			:postcode="formData.postcode.value"
			example-placeholder="donation_form_city_placeholder"
			@field-changed="$emit('field-changed', 'city' )"
		>
			<ValueEqualsPlaceholderWarning
				:value="formData.city.value"
				:placeholder="$t( 'donation_form_city_placeholder' )"
				warning="donation_form_city_placeholder_warning"
			/>
		</CityAutocompleteField>

		<ScrollTarget target-id="country-scroll-target"/>
		<CountryAutocompleteField
			v-model="formData.country.value"
			input-id="country"
			scroll-target-id="country-scroll-target"
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

import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { useStore } from 'vuex';
import { StoreKey } from '@src/store/donation_store';
import { useAddressTypeModel } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeModel';
import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { computed } from 'vue';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import { Country } from '@src/view_models/Country';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

interface Props {
	formData: AddressFormData;
	showError: AddressValidity;
	countries: Country[];
	postCodeValidation: string;
	countryWasRestored: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed' ] );

const store = useStore( StoreKey );
const addressType = useAddressTypeModel( store );

const showStreetWarning = computed<boolean>( () => /^\D+$/.test( props.formData.street.value ) );
const showAddressTypeError = computed( () => store.getters[ 'address/addressTypeIsInvalid' ] );

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

<style scoped lang="scss">

</style>
