<template>
	<ErrorSummary
		v-if="!receiptModel.receiptNeeded && addressType === AddressTypeModel.UNSET"
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
				validity: receiptModel.showReceiptOptionError ? Validity.INVALID : Validity.VALID,
				message: $t( 'C24_WMDE_Desktop_DE_01_receipt_error' ),
				focusElement: 'donationReceipt-0',
				scrollElement: 'address-form-receipt',
			},
		]"
	/>
	<ErrorSummary
		v-if="( receiptModel.receiptNeeded && addressType === AddressTypeModel.UNSET ) || addressType === AddressTypeModel.PERSON"
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
				validity: store.state.address.validity.addressType,
				message: $t( 'donation_form_section_address_error' ),
				focusElement: 'addressType-0',
				scrollElement: 'address-form-type',
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
		v-if="addressType === AddressTypeModel.COMPANY_WITH_CONTACT"
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
				validity: store.state.address.validity.addressType,
				message: $t( 'donation_form_section_address_error' ),
				focusElement: 'addressType-0',
				scrollElement: 'address-form-type',
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
		]"
	/>
</template>

<script setup lang="ts">

import { toRef } from 'vue';
import { useStore } from 'vuex';
import ErrorSummary from '@src/components/shared/ErrorSummary.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import type { ReturnType as ReceiptModel } from '@src/components/shared/composables/useReceiptModel';

interface Props {
	showErrorSummary: boolean;
	addressType: AddressTypeModel;
	receiptModel: ReceiptModel;
}

const props = defineProps<Props>();
const store = useStore();
const receiptModel = toRef<ReceiptModel>( props.receiptModel );

</script>
