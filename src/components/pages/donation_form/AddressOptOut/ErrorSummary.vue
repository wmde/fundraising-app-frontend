<template>
	<ErrorSummary
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
				validity: store.state.bankdata.validity.iban,
				message: $t( 'donation_form_payment_iban_error' ),
				focusElement: 'iban',
				scrollElement: 'iban-scroll-target'
			},
			{
				validity: store.state.address.validity.addressType,
				message: $t( 'error_summary_address_type_opt_out' ),
				focusElement: 'addressOptOut-1',
				scrollElement: 'address-opt-out-scroll-target',
			},
		]"
	/>
</template>

<script setup lang="ts">
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import { useStore } from 'vuex';

const store = useStore();

interface Props {
	showErrorSummary: boolean;
}

defineProps<Props>();

</script>
