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
import { defineComponent } from 'vue';
import Payment from '@src/components/pages/donation_form/Payment.vue';
import { action } from '@src/store/util';
import { NS_PAYMENT } from '@src/store/namespaces';
import { markEmptyValuesAsInvalid } from '@src/store/payment/actionTypes';
import { waitForServerValidationToFinish } from '@src/wait_for_server_validation';
import { trackDynamicForm, trackFormSubmission } from '@src/tracking';
import scrollToFirstError from '@src/scroll_to_first_error';
import FunButton from '@src/components/shared/form_inputs/FunButton.vue';

export default defineComponent( {
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
