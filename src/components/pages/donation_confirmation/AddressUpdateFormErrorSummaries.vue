<template>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.PERSON || addressType === AddressTypeModel.ANON || addressType === AddressTypeModel.EMAIL"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.address.validity.addressType,
				message: $t( 'donation_form_section_address_error' ),
				focusElement: 'addressType-0',
				scrollElement: 'address-form-type',
			},
			{
				validity: store.state.address.validity.salutation,
				message: $t( 'donation_form_salutation_error' ),
				focusElement: 'salutation-0',
				scrollElement: 'address-form-salutation',
			},
			{
				validity: store.state.address.validity.firstName,
				message: $t( 'donation_form_firstname_error' ),
				focusElement: 'first-name',
				scrollElement: 'address-form-first-name',
			},
			{
				validity: store.state.address.validity.lastName,
				message: $t( 'donation_form_lastname_error' ),
				focusElement: 'last-name',
				scrollElement: 'address-form-last-name',
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'street',
				scrollElement: 'address-form-street',
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'post-code',
				scrollElement: 'address-form-post-code',
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'city',
				scrollElement: 'address-form-city',
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'country',
				scrollElement: 'address-form-country',
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email',
				scrollElement: 'address-form-email',
			},
		]"
	/>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.COMPANY"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.address.validity.companyName,
				message: $t( 'donation_form_companyname_error' ),
				focusElement: 'company-name',
				scrollElement: 'address-form-company-name',
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'street',
				scrollElement: 'address-form-street',
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'post-code',
				scrollElement: 'address-form-post-code',
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'city',
				scrollElement: 'address-form-city',
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'country',
				scrollElement: 'address-form-country',
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email',
				scrollElement: 'address-form-email',
			},
		]"
	/>
</template>

<script setup lang="ts">

import ErrorSummary from '@src/components/shared/ErrorSummary.vue';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

interface Props {
	showErrorSummary: boolean;
	addressType: AddressTypeModel;
}

defineProps<Props>();
const store = useStore();

</script>
