<template>
	<div class="payment-summary-banner has-outside-border has-margin-top-0 has-margin-bottom-18">
		<p v-html="getSummary()"></p>
		<FunButton
			@click="$emit( 'previous-page' )"
			class="button is-primary is-low is-outlined"
		>
			{{ $t('donation_form_section_back') }}
		</FunButton>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import FunButton from '@/components/shared/form_inputs/FunButton.vue';

export default Vue.extend( {
	name: 'PaymentSummary',
	components: { FunButton },
	props: [ 'amount', 'interval', 'paymentType' ],
	methods: {
		getSummary: function () {
			const interval = this.$t( 'donation_form_payment_interval_' + this.$props.interval );
			const formattedAmount = this.$n( this.$props.amount, { key: 'currency', currencyDisplay: 'name' } );
			const paymentType = this.$t( this.$props.paymentType );
			return this.$t( 'donation_form_payment_summary', { interval: interval, formattedAmount, paymentType } );
		},
	},
} );
</script>
