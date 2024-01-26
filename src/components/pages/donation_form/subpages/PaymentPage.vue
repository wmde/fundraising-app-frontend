<template>
	<form
		name="laika-donation-payment"
		id="laika-donation-payment"
		class="payment-page"
		ref="paymentForm"
		action="/donation/add"
		method="post"
		@keydown.enter.prevent="next()"
	>
		<h1 class="form-title" v-html="$t( 'donation_form_section_address_headline' )"/>

		<Payment
			:payment-amounts="paymentAmounts"
			:payment-intervals="paymentIntervals"
			:payment-types="paymentTypes"
		/>

		<FormButton
			id="next"
			@click="next()"
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
import scrollToFirstError from '@src/util/scroll_to_first_error';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import { useStore } from 'vuex';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

defineProps<Props>();
const emit = defineEmits( [ 'next-page' ] );

const store = useStore();
const paymentForm = ref<HTMLFormElement>( null );

const next = async (): Promise<any> => {
	await waitForServerValidationToFinish( store );
	store.dispatch( action( NS_PAYMENT, markEmptyValuesAsInvalid ) ).then( () => {
		if ( store.getters[ NS_PAYMENT + '/paymentDataIsValid' ] ) {
			trackFormSubmission( paymentForm.value );
			emit( 'next-page' );
		} else {
			scrollToFirstError();
		}
	} );
};

onMounted( trackDynamicForm );

</script>
