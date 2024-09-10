<template>
	<div
		id="single-page-form-section-payment"
		class="single-page-form-section"
	>
		<h1 id="donation-form-heading" class="form-title">{{ $t( 'donation_form_heading' ) }}</h1>
		<h2 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_payment_subheading' ) }}</h2>

		<form
			name="laika-donation-payment"
			class="payment-page"
			ref="paymentForm"
		>
			<Payment
				:payment-amounts="paymentAmounts"
				:payment-intervals="paymentIntervals"
				:payment-types="paymentTypes"
			/>
		</form>
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
