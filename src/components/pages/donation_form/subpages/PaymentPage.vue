<template>
	<form name="laika-donation-payment"
		id="laika-donation-payment"
		class="payment-page"
		ref="payment"
		action="/donation/add"
		method="post"
		@keydown.enter.prevent="next()">
		<payment v-bind="$props"></payment>
		<div class="level has-margin-top-18">
			<div class="level-left">
				<FunButton
					id="next"
					:class="[ 'is-form-input-width is-primary is-main level-item', { 'is-loading': $store.getters.isValidating } ]"
					@click="next()"
				>
					{{ $t('donation_form_section_continue') }}
				</FunButton>
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import Vue from 'vue';
import Payment from '@/components/pages/donation_form/Payment.vue';
import { action } from '@/store/util';
import { NS_PAYMENT } from '@/store/namespaces';
import { markEmptyValuesAsInvalid } from '@/store/payment/actionTypes';
import { waitForServerValidationToFinish } from '@/wait_for_server_validation';
import { trackDynamicForm, trackFormSubmission } from '@/tracking';
import scrollToFirstError from '@/scroll_to_first_error';
import FunButton from '@/components/shared/form_inputs/FunButton.vue';

export default Vue.extend( {
	name: 'PaymentPage',
	components: {
		FunButton,
		Payment,
	},
	props: {
		assetsPath: String,
		paymentAmounts: Array as () => Array<String>,
		paymentIntervals: Array as () => Array<Number>,
		paymentTypes: Array as () => Array<String>,
	},
	mounted() {
		trackDynamicForm();
	},
	methods: {
		next() {
			return waitForServerValidationToFinish( this.$store ).then( () => {
				this.$store.dispatch( action( NS_PAYMENT, markEmptyValuesAsInvalid ) ).then( () => {
					if ( this.$store.getters[ NS_PAYMENT + '/paymentDataIsValid' ] ) {
						const formPayment = this.$refs.payment as HTMLFormElement;
						trackFormSubmission( formPayment );
						this.$emit( 'next-page' );
					} else {
						scrollToFirstError();
					}
				} );
			} );
		},
	},
} );
</script>
