<template>
	<ContentCard>
		<template #heading>
			<h1 id="donation-form-heading">{{ $t( 'donation_form_heading' ) }}</h1>
			<h2 id="donation-form-subheading">1. {{ $t( 'compact_donation_form_payment_heading' ) }}</h2>
		</template>
		<template #content>
			<slot name="error-summary"/>

			<p>{{ $t( 'compact_donation_form_payment_blurb' ) }}</p>

			<PaymentSummary
				v-if="state === FormStates.showSummary"
				@show-payment-form="showPaymentForm"
				:amount="paymentSummary.amount"
				:interval="paymentSummary.interval"
				:payment-type="paymentSummary.paymentType"
			/>

			<div v-if="state === FormStates.showSummaryAndPaymentType" class="show-summary-and-payment-type flow">
				<PaymentSummary
					@show-payment-form="showPaymentForm"
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
				v-if="state === FormStates.showEntireForm"
				name="laika-donation-payment"
				class="flow compact"
				ref="paymentForm"
				@submit.prevent
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
import Payment from '@src/components/pages/donation_form/Payment/Payment.vue';
import { nextTick, ref } from 'vue';
import PaymentSummary from '@src/components/pages/donation_form/Summaries/PaymentSummary.vue';
import { useStore } from 'vuex';
import { usePaymentFunctions } from '@src/components/pages/donation_form/composables/usePaymentFunctions';
import { Validity } from '@src/view_models/Validity';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IbanFields from '@src/components/pages/donation_form/Payment/IbanFields.vue';
import { useAmountFocuser } from '@src/components/shared/composables/useAmountFocuser';

enum FormStates {
	showEntireForm = 'showEntireForm',
	showSummary = 'showSummary',
	showSummaryAndPaymentType = 'showSummaryAndPaymentType',
}

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	isDirectDebitPayment: boolean;
}

defineProps<Props>();
const store = useStore();
const focusAmount = useAmountFocuser( useStore() );

const initialFormState = (): FormStates => {
	if ( store.state.payment.validity.type === Validity.VALID && store.state.payment.validity.amount === Validity.VALID ) {
		return FormStates.showSummary;
	} else if ( store.state.payment.validity.amount === Validity.VALID ) {
		return FormStates.showSummaryAndPaymentType;
	} else {
		return FormStates.showEntireForm;
	}
};

const state = ref<FormStates>( initialFormState() );

const { paymentSummary } = usePaymentFunctions( store );

const showPaymentForm = async () => {
	state.value = FormStates.showEntireForm;
	await nextTick();
	focusAmount();
};

</script>
