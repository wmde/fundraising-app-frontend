<template>
	<ErrorSummary
		v-if="addressType === AddressTypeModel.PERSON || addressType === AddressTypeModel.UNSET"
		:is-visible="showErrorSummary"
		:items="[
			{
				validity: store.state.payment.validity.amount,
				message: $t( 'error_summary_amount' ),
				focusElement: 'amount-500',
				scrollElement: 'payment-form-amount',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type',
			},
			{
				validity: store.state.bankdata.validity.iban,
				message: $t( 'donation_form_payment_iban_error' ),
				focusElement: 'iban',
				scrollElement: 'payment-form-iban'
			},
			{
				validity: store.state.address.validity.addressType,
				message: $t( 'donation_form_section_address_error' ),
				focusElement: 'addressType-0',
				scrollElement: 'address-form-type'
			},
			{
				validity: store.state.address.validity.salutation,
				message: $t( 'donation_form_salutation_error' ),
				focusElement: 'person-salutation-0',
				scrollElement: 'person-address-form-salutation'
			},
			{
				validity: store.state.address.validity.firstName,
				message: $t( 'donation_form_firstname_error' ),
				focusElement: 'person-first-name',
				scrollElement: 'person-address-form-first-name',
			},
			{
				validity: store.state.address.validity.lastName,
				message: $t( 'donation_form_lastname_error' ),
				focusElement: 'person-last-name',
				scrollElement: 'person-address-form-last-name',
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'person-country',
				scrollElement: 'person-address-form-country',
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'person-post-code',
				scrollElement: 'person-address-form-post-code',
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'person-city',
				scrollElement: 'person-address-form-city',
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'person-street',
				scrollElement: 'person-address-form-street',
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'person-email',
				scrollElement: 'person-address-form-email',
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
				scrollElement: 'payment-form-amount',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type',
			},
			{
				validity: store.state.bankdata.validity.iban,
				message: $t( 'donation_form_payment_iban_error' ),
				focusElement: 'iban',
				scrollElement: 'payment-form-iban',
			},
			{
				validity: store.state.address.validity.companyName,
				message: $t( 'donation_form_companyname_error' ),
				focusElement: 'company-company-name',
				scrollElement: 'company-address-form-company-name',
			},
			{
				validity: store.state.address.validity.country,
				message: $t( 'donation_form_country_error' ),
				focusElement: 'company-country',
				scrollElement: 'company-address-form-country',
			},
			{
				validity: store.state.address.validity.postcode,
				message: $t( 'donation_form_zip_error' ),
				focusElement: 'company-post-code',
				scrollElement: 'company-address-form-post-code',
			},
			{
				validity: store.state.address.validity.city,
				message: $t( 'donation_form_city_error' ),
				focusElement: 'company-city',
				scrollElement: 'company-address-form-city',
			},
			{
				validity: store.state.address.validity.street,
				message: $t( 'donation_form_street_error' ),
				focusElement: 'company-street',
				scrollElement: 'company-address-form-street',
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'company-email',
				scrollElement: 'company-address-form-email',
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
				scrollElement: 'payment-form-amount',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type',
			},
			{
				validity: store.state.bankdata.validity.iban,
				message: $t( 'donation_form_payment_iban_error' ),
				focusElement: 'iban',
				scrollElement: 'payment-form-iban',
			},
			{
				validity: store.state.address.validity.salutation,
				message: $t( 'donation_form_salutation_error' ),
				focusElement: 'email-salutation-0',
				scrollElement: 'email-address-form-salutation'
			},
			{
				validity: store.state.address.validity.firstName,
				message: $t( 'donation_form_firstname_error' ),
				focusElement: 'email-first-name',
				scrollElement: 'email-address-form-first-name',
			},
			{
				validity: store.state.address.validity.lastName,
				message: $t( 'donation_form_lastname_error' ),
				focusElement: 'email-last-name',
				scrollElement: 'email-address-form-last-name',
			},
			{
				validity: store.state.address.validity.email,
				message: $t( 'donation_form_email_error' ),
				focusElement: 'email-email',
				scrollElement: 'email-address-form-email',
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
				scrollElement: 'payment-form-amount',
			},
			{
				validity: store.state.payment.validity.type,
				message: $t( 'error_summary_payment_type' ),
				focusElement: 'paymentType-0',
				scrollElement: 'payment-form-type',
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
