<template>
	<ErrorSummary
		v-if="[ 'email', 'person', 'anonym' ].includes( addressType )"
		:is-visible="showErrorSummary"
		:items="[
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
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email',
				scrollElement: 'address-form-email',
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'country',
				scrollElement: 'address-form-country',
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
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'street',
				scrollElement: 'address-form-street',
			},
		]"
	/>
	<ErrorSummary
		v-if="addressType === 'company_with_contact'"
		:is-visible="showErrorSummary"
		:items="[
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
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email',
				scrollElement: 'address-form-email',
			},
			{
				validity: store.state.address.validity.companyName,
				message: $t( 'donation_form_companyname_error' ),
				focusElement: 'company-name',
				scrollElement: 'address-form-company-name',
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'country',
				scrollElement: 'address-form-country',
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
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'street',
				scrollElement: 'address-form-street',
			},
		]"
	/>
</template>

<script setup lang="ts">

import ErrorSummary from '@src/components/shared/ErrorSummary.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { AddressType } from '@src/store/address/constants';

interface Props {
	showErrorSummary: boolean;
}

defineProps<Props>();
const store = useStore();
const addressType = computed<AddressType>( () => store.getters[ 'address/addressType' ] );

</script>
