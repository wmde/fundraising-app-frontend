<template>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.PERSON || addressType === AddressTypeModel.UNSET"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.payment.validity.amount,
				message: $t( 'error_summary_amount' ),
				focusElement: 'amount-500',
				scrollElement: 'payment-form-amount-scroll-target',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type-scroll-target',
			},
			{
				validity: store.state.bankdata.validity.bankdata,
				message: $t( 'donation_form_payment_bankdata_error' ),
				focusElement: 'iban',
				scrollElement: 'iban-scroll-target'
			},
			{
				validity: store.state.address.validity.addressType,
				message: $t( 'donation_form_section_address_error' ),
				focusElement: 'addressType-0',
				scrollElement: 'address-type-scroll-target'
			},
			{
				validity: store.state.address.validity.salutation,
				message: $t( 'donation_form_salutation_error' ),
				focusElement: 'person-salutation-0',
				scrollElement: 'person-salutation-scroll-target'
			},
			{
				validity: store.state.address.validity.firstName,
				message: $t( 'donation_form_firstname_error' ),
				focusElement: 'person-first-name',
				scrollElement: 'person-first-name-scroll-target'
			},
			{
				validity: store.state.address.validity.lastName,
				message: $t( 'donation_form_lastname_error' ),
				focusElement: 'person-last-name',
				scrollElement: 'person-last-name-scroll-target'
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'person-street',
				scrollElement: 'person-street-scroll-target'
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'person-post-code',
				scrollElement: 'person-post-code-scroll-target'
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'person-city',
				scrollElement: 'person-city-scroll-target'
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'person-country',
				scrollElement: 'person-country-scroll-target'
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'person-email',
				scrollElement: 'person-email-scroll-target'
			},
		]"
	/>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.COMPANY"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.payment.validity.amount,
				message: $t( 'error_summary_amount' ),
				focusElement: 'amount-500',
				scrollElement: 'payment-form-amount-scroll-target',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type-scroll-target',
			},
			{
				validity: store.state.bankdata.validity.bankdata,
				message: $t( 'donation_form_payment_bankdata_error' ),
				focusElement: 'iban',
				scrollElement: 'iban-scroll-target'
			},
			{
				validity: store.state.address.validity.companyName,
				message: $t( 'donation_form_companyname_error' ),
				focusElement: 'company-company-name',
				scrollElement: 'company-company-name-scroll-target'
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'company-street',
				scrollElement: 'company-street-scroll-target'
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'company-post-code',
				scrollElement: 'company-post-code-scroll-target'
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'company-city',
				scrollElement: 'company-city-scroll-target'
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'company-country',
				scrollElement: 'company-country-scroll-target'
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'company-email',
				scrollElement: 'company-email-scroll-target'
			},
		]"
	/>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.EMAIL"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.payment.validity.amount,
				message: $t( 'error_summary_amount' ),
				focusElement: 'amount-500',
				scrollElement: 'payment-form-amount-scroll-target',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type-scroll-target',
			},
			{
				validity: store.state.address.validity.salutation,
				message: $t( 'donation_form_salutation_error' ),
				focusElement: 'email-salutation-0',
				scrollElement: 'email-salutation-scroll-target'
			},
			{
				validity: store.state.address.validity.firstName,
				message: $t( 'donation_form_firstname_error' ),
				focusElement: 'email-first-name',
				scrollElement: 'email-first-name-scroll-target'
			},
			{
				validity: store.state.address.validity.lastName,
				message: $t( 'donation_form_lastname_error' ),
				focusElement: 'email-last-name',
				scrollElement: 'email-last-name-scroll-target'
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email-email',
				scrollElement: 'email-email-scroll-target'
			},
		]"
	/>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.ANON"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.payment.validity.amount,
				message: $t( 'error_summary_amount' ),
				focusElement: 'amount-500',
				scrollElement: 'payment-form-amount-scroll-target',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type-scroll-target',
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
