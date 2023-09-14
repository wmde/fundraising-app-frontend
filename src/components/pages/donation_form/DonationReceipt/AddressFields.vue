<template>
	<div class="address-section">

		<RadioField
			v-model="addressType"
			name="addressTypeSelector"
			:options="[
				{ value: AddressTypeModel.PERSON, label: $t( 'donation_form_addresstype_option_private_addresstype' ) },
				{ value: AddressTypeModel.COMPANY_WITH_CONTACT, label: $t( 'donation_form_addresstype_option_company_addresstype' ) },
			]"
			:label="$t( 'donation_form_address_choice_title_addresstype_basic' )"
			:show-error="showAddressTypeError"
			:error-message="$t( 'donation_form_section_address_error' )"
		/>

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

		<TextField
			name="postcode"
			input-id="post-code"
			v-model="formData.postcode.value"
			:show-error="showError.postcode"
			:error-message="$t('donation_form_zip_error')"
			autocomplete="street-address"
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

		<CityAutocompleteField
			v-model="formData.city.value"
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

		<CountryAutocompleteField
			v-model="formData.country.value"
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
