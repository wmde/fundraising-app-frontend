<template>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.PERSON || addressType === AddressTypeModel.ANON || addressType === AddressTypeModel.EMAIL"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.address.validity.addressType,
				message: $t( 'donation_form_section_address_error' ),
				focusElement: 'addressType-0',
				scrollElement: 'address-type-scroll-target'
			},
			{
				validity: store.state.address.validity.salutation,
				message: $t( 'donation_form_salutation_error' ),
				focusElement: 'salutation-0',
				scrollElement: 'salutation-scroll-target'
			},
			{
				validity: store.state.address.validity.firstName,
				message: $t( 'donation_form_firstname_error' ),
				focusElement: 'first-name',
				scrollElement: 'first-name-scroll-target'
			},
			{
				validity: store.state.address.validity.lastName,
				message: $t( 'donation_form_lastname_error' ),
				focusElement: 'last-name',
				scrollElement: 'last-name-scroll-target'
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'street',
				scrollElement: 'street-scroll-target'
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'post-code',
				scrollElement: 'post-code-scroll-target'
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'city',
				scrollElement: 'city-scroll-target'
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'country',
				scrollElement: 'country-scroll-target'
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email',
				scrollElement: 'email-scroll-target'
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
				scrollElement: 'company-name-scroll-target'
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'street',
				scrollElement: 'street-scroll-target'
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'post-code',
				scrollElement: 'post-code-scroll-target'
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'city',
				scrollElement: 'city-scroll-target'
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'country',
				scrollElement: 'country-scroll-target'
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email',
				scrollElement: 'email-scroll-target'
			},
		]"
	/>
</template>

<script setup lang="ts">

import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

interface Props {
	showErrorSummary: boolean;
	addressType: AddressTypeModel;
}

defineProps<Props>();
const store = useStore();

</script>
