<template>
	<CheckboxField
		v-model="isCompanyModel"
		name="is-company"
		id="address-form-is-company"
		input-id="is-company"
		:error-message="$t( 'donation_form_section_address_error' )"
		:show-error="showAddressTypeError"
		:aria-describedby="describedBy"
		@field-changed="onIsCompanyToggled"
	>
		<span>{{ $t( 'donation_form_behalf_of_company' ) }}</span>
	</CheckboxField>

	<TextField
		v-if="isCompanyModel"
		name="companyName"
		id="address-form-company-name"
		input-id="company-name"
		v-model="formData.companyName.value"
		:show-error="showError.companyName"
		:error-message="$t( 'donation_form_companyname_error' )"
		autocomplete="organization"
		:label="$t( 'donation_form_companyname_label' )"
		:placeholder="$t( 'donation_form_companyname_placeholder' )"
		:aria-describedby="describedBy"
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
			:aria-describedby="describedBy"
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
			:aria-describedby="describedBy"
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
			:aria-describedby="describedBy"
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
			:aria-describedby="describedBy"
			@field-changed="$emit('field-changed', 'street' )"
		/>
	</div>

	<Callout type="neutral" :has-action="true" v-if="!receiptNeeded">
		<p id="address-notice">{{ $t( 'donation_form_optional_address_message' ) }}</p>
		<button type="button" class="link-button" @click.prevent="clearAddress">{{ $t( 'donation_form_clear_all_address' ) }}</button>
	</Callout>
</template>

<script setup lang="ts">

import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { useStore } from 'vuex';
import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed, inject, onBeforeMount, ref } from 'vue';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import StreetAutocompleteField from '@src/components/shared/form_fields/StreetAutocompleteField.vue';
import type { Country } from '@src/view_models/Country';
import { Validity } from '@src/view_models/Validity';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';
import Callout from '@src/components/patterns/Callout.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';

interface Props {
	formData: AddressFormData;
	showError: AddressValidity;
	countries: Country[];
	postCodeValidation: string;
	receiptNeeded: boolean;
	addressType: AddressTypeModel;
	isCompany: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed', 'update:is-company', 'clear-address' ] );
const trackEvent = inject<( eventName: string, category: string, action: string ) => void>( 'trackEvent' );
const store = useStore();

const showAddressTypeError = computed( () => store.getters[ 'address/addressTypeIsInvalid' ] );
const countryWasRestored = ref<boolean>( false );
const isCompanyModel = useFieldModel<boolean>( () => props.isCompany, props.isCompany );
const describedBy = computed<string>( () => props.addressType === AddressTypeModel.EMAIL ? 'address-notice' : '' );

const onIsCompanyToggled = (): void => {
	emit( 'update:is-company', isCompanyModel.value );
};

const clearAddress = (): void => {
	isCompanyModel.value = false;
	onIsCompanyToggled();
	emit( 'clear-address' );

	props.formData.companyName.value = '';
	props.formData.street.value = '';
	props.formData.postcode.value = '';
	props.formData.city.value = '';

	emit( 'field-changed', 'companyName' );
	emit( 'field-changed', 'street' );
	emit( 'field-changed', 'postcode' );
	emit( 'field-changed', 'city' );

	trackEvent( 'address-form-cleared', 'Compact Donation Form', 'button click by donor' );
};

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
