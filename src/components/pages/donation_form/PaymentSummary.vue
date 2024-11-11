<template>
	<div class="payment-summary">
		<div class="payment-summary-text">
			<p v-html="props.paymentType ? summary : summaryWithoutPaymentType"/>
		</div>
		<div class="payment-summary-link">
			<a href="#" @click.prevent="$emit( 'show-payment-form' )">{{ $t('donation_form_section_back') }}</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

interface Props {
	amount: number;
	interval: string;
	paymentType?: string;
}

const { t, n } = useI18n();
const props = withDefaults( defineProps<Props>(), { paymentType: '' } );

const summary = computed( () => {
	const interval = t( 'donation_form_payment_interval_' + props.interval );
	const formattedAmount = n( props.amount, { key: 'currency', currencyDisplay: 'name' } );
	const paymentType = t( props.paymentType );
	return t( 'donation_form_payment_summary', { interval, formattedAmount, paymentType } );
} );

const summaryWithoutPaymentType = computed( () => {
	const interval = t( 'donation_form_payment_interval_' + props.interval );
	const formattedAmount = n( props.amount, { key: 'currency', currencyDisplay: 'name' } );
	return t( 'donation_form_payment_summary_payment_type_missing', { interval, formattedAmount } );
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
		margin: 0 0 map.get( units.$spacing, 'large' );
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
