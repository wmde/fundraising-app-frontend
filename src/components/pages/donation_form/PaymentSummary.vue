<template>
	<div class="alert-box repel" data-neutral>
		<p v-html="props.paymentType ? summary : summaryWithoutPaymentType"/>
		<a href="#" @click.prevent="$emit( 'show-payment-form' )"><strong>{{ $t('donation_form_section_back') }}</strong></a>
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
