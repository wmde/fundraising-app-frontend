<template>
	<div class="payment-summary">
		<div class="payment-summary-text">
			<p v-html="getSummary()"/>
		</div>
		<div class="payment-summary-link">
			<a href="#" @click.prevent="$emit( 'previous-page' )">{{ $t('donation_form_section_back') }}</a>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';

export default defineComponent( {
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

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.payment-summary {
	display: flex;
	align-items: center;
	border: 2px solid colors.$gray-light;
	padding: map.get( units.$spacing, 'small' );
	margin: 0 0 map.get( units.$spacing, 'large' );

	@include breakpoints.tablet-up {
		margin: 0 ( -( map.get( units.$spacing, 'xx-small' ) ) ) map.get( units.$spacing, 'large' );
	}

	&-text {
		flex: 1 1 auto;
		padding-right: map.get( units.$spacing, 'small' );
	}

	&-link {
		flex: 0 0 auto;
		text-align: right;
		font-weight: bold;
	}
}
</style>
