<template>
	<div
		class="form-section-payment"
	>
		<Payment
			:payment-amounts="paymentAmounts"
			:payment-intervals="paymentIntervals"
			:payment-types="paymentTypes"
		/>
	</div>
</template>

<script setup lang="ts">
import Payment from '@src/components/pages/donation_form/Payment.vue';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}
defineProps<Props>();

</script>
