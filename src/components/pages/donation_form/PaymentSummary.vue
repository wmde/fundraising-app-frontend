<template>
	<div class="payment-summary-banner has-outside-border has-margin-top-0 has-margin-bottom-18">
		<p v-html="getSummary()"></p>
		<b-button @click="$emit( 'previous-page' )"
				type="is-primary is-low"
				outlined>
			{{ $t('donation_form_section_back') }}
		</b-button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'PaymentSummary',
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
