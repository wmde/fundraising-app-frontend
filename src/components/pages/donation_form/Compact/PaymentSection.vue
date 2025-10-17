<template>
	<ContentCard>
		<template #heading>
			<h1 id="donation-form-heading">{{ $t( 'donation_form_heading' ) }}</h1>
			<h2 id="donation-form-subheading">1. {{ $t( 'donation_form_payment_subheading' ) }}</h2>
		</template>
		<template #content>
			<slot name="error-summary"/>

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
					:display-sections="[ 'paymentType' ]"
				/>

			</div>

			<form
				v-if="state === 'showEntireForm'"
				name="laika-donation-payment"
				class="flow compact"
				ref="paymentForm"
			>
				<Payment
					:payment-amounts="paymentAmounts"
					:payment-intervals="paymentIntervals"
					:payment-types="paymentTypes"
				/>
			</form>

			<IbanFields v-if="isDirectDebitPayment"/>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import Payment from '@src/components/pages/donation_form/Payment.vue';
import { ref } from 'vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import { useStore } from 'vuex';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { Validity } from '@src/view_models/Validity';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IbanFields from '@src/components/shared/IbanFields.vue';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	isDirectDebitPayment: boolean;
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
