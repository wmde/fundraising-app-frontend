<template>
	<p> {{ $t( 'donation_form_summary_headline' ) }}
		{{ formattedAmount }}
		<template v-if="interval"> {{ interval }}</template>
		<template v-if="paymentType"> {{ $t('donation_summary_via') }} {{ paymentType }}</template>
	</p>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
	payment: { amount: number; interval: any; paymentType: any };
}
const props = defineProps<Props>();
const { t, n } = useI18n();

const formattedAmount = computed( () => n( props.payment.amount, { key: 'currency', currencyDisplay: 'name' } ) );

const interval = computed( () => props.payment.interval ? t( 'donation_form_payment_interval_' + props.payment.interval ) : '' );

const paymentType = computed( () => props.payment.paymentType ? t( props.payment.paymentType ) : '' );
</script>
