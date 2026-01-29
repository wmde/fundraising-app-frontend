<template>
	<ContentCard>
		<template #heading>
			<h1 id="donation-form-heading">{{ $t( 'donation_form_heading' ) }}</h1>
			<h2 id="donation-form-subheading">{{ $t( 'donation_form_payment_subheading' ) }}</h2>
		</template>
		<template #content>
			<slot name="error-summary"/>

			<PaymentSummary
				v-if="state === FormStates.showSummary"
				@show-payment-form="showPaymentForm"
				:amount="paymentSummary.amount"
				:interval="paymentSummary.interval"
				:payment-type="paymentSummary.paymentType"
			/>

			<div v-if="state === 'showSummaryAndPaymentType'" class="show-summary-and-payment-type flow">
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
				class="payment-page flow"
				ref="paymentForm"
				@submit.prevent
			>
				<Payment
					:payment-amounts="paymentAmounts"
					:payment-intervals="paymentIntervals"
					:payment-types="paymentTypes"
				/>
			</form>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import Payment from '@src/components/pages/donation_form/Payment.vue';
import { nextTick, ref } from 'vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import { useStore } from 'vuex';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { Validity } from '@src/view_models/Validity';
import ContentCard from '@src/components/patterns/ContentCard.vue';
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
