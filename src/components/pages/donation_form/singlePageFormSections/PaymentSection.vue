<template>
	<ScrollTarget target-id="payment-section-top-scroll-target"/>
	<div
		id="donation-page-form-section-payment"
		class="donation-page-form-section"
	>
		<h1 id="donation-form-heading" class="form-title">{{ $t( 'donation_form_heading' ) }}</h1>
		<h2 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_payment_subheading' ) }}</h2>

		<PaymentSummary
			v-if="state === 'showSummary'"
			@show-payment-form="state='showEntireForm'"
			:amount="paymentSummary.amount"
			:interval="paymentSummary.interval"
			:payment-type="paymentSummary.paymentType"
		/>

		<div v-if="state === 'showSummaryAndPaymentType'" class="show-summary-and-payment-type">
			<PaymentSummary
				@show-payment-form="state='showEntireForm'"
				:amount="paymentSummary.amount"
				:interval="paymentSummary.interval"
				:payment-type="paymentSummary.paymentType"
			/>
			<Payment
				:payment-amounts="paymentAmounts"
				:payment-intervals="paymentIntervals"
				:payment-types="paymentTypes"
			/>
		</div>

		<form
			v-if="state === 'showEntireForm'"
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
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { ref } from 'vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import { useStore } from 'vuex';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { Validity } from '@src/view_models/Validity';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

defineProps<Props>();

type formStates = 'showEntireForm' | 'showSummary' | 'showSummaryAndPaymentType';
const store = useStore();
let initialFormState: formStates;

if ( store.state.payment.validity.type === Validity.VALID && store.state.payment.validity.amount === Validity.VALID ) {
	initialFormState = 'showSummary';
} else if ( store.state.payment.validity.amount === Validity.VALID ) {
	initialFormState = 'showSummaryAndPaymentType';
} else {
	initialFormState = 'showEntireForm';
}

const state = ref<formStates>( initialFormState );

const { paymentSummary } = usePaymentFunctions( store );

</script>
<style>
.show-summary-and-payment-type #payment-form-amount,
.show-summary-and-payment-type #payment-form-interval {
	display: none;
}
</style>
