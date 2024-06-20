<template>
	<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
	<form
		name="laika-donation-payment"
		id="laika-donation-payment"
		class="payment-page"
		ref="paymentForm"
		@keydown.enter.prevent="next()"
		@submit.prevent="next()"
	>
		<h1 class="form-title" v-html="$t( 'donation_form_section_address_headline' )"/>

		<Payment
			:payment-amounts="paymentAmounts"
			:payment-intervals="paymentIntervals"
			:payment-types="paymentTypes"
		/>

		<ErrorSummary
			:is-visible="showErrorSummary"
			:items="[
				{
					validity: store.state.payment.validity.amount,
					message: $t( 'error_summary_amount' ),
					focusElement: 'amount-500',
					scrollElement: 'payment-form-amount-scroll-target'
				},
				{
					validity: store.state.payment.validity.type,
					message: $t( 'error_summary_payment_type' ),
					focusElement: 'paymentType-0',
					scrollElement: 'payment-form-type-scroll-target'
				}
			]"
		/>

		<FormButton
			id="next"
			button-type="submit"
			@click.prevent="next()"
			:is-loading="store.getters.isValidating"
		>
			{{ $t( 'donation_form_section_continue' ) }}
		</FormButton>

	</form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Payment from '@src/components/pages/donation_form/Payment.vue';
import { action } from '@src/store/util';
import { NS_PAYMENT } from '@src/store/namespaces';
import { markEmptyValuesAsInvalid } from '@src/store/payment/actionTypes';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import { useStore } from 'vuex';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

defineProps<Props>();
const emit = defineEmits( [ 'next-page' ] );

const store = useStore();
const paymentForm = ref<HTMLFormElement>( null );
const showErrorSummary = ref<boolean>( false );

const next = async (): Promise<any> => {
	await waitForServerValidationToFinish( store );
	store.dispatch( action( NS_PAYMENT, markEmptyValuesAsInvalid ) ).then( () => {
		if ( store.getters[ NS_PAYMENT + '/paymentDataIsValid' ] ) {
			trackFormSubmission( paymentForm.value );
			emit( 'next-page' );
		} else {
			showErrorSummary.value = true;
		}
	} );
};

store.watch( ( state, getters ) => getters[ NS_PAYMENT + '/paymentDataIsValid' ], ( isValid: boolean ) => {
	if ( showErrorSummary.value && isValid ) {
		showErrorSummary.value = false;
	}
} );

onMounted( trackDynamicForm );

</script>
