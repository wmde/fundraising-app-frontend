<template>
	<p v-if="paymentSummary"> {{ $t( 'donation_form_summary_headline' ) }}
		{{ formattedAmount }}
		<template v-if="interval"> {{ interval }}</template>
		<template v-if="paymentType"> {{ $t('donation_summary_via') }} {{ paymentType }}</template>
	</p>
</template>
<script setup lang="ts">
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const { t, n } = useI18n();
const store = useStore();
const { paymentSummary } = usePaymentFunctions( store );

const formattedAmount = computed( () => n( paymentSummary.value.amount, { key: 'currency', currencyDisplay: 'name' } ) );

const interval = computed( () => paymentSummary.value.interval ? t( 'donation_form_payment_interval_' + paymentSummary.value.interval ) : '' );

const paymentType = computed( () => paymentSummary.value.paymentType ? t( paymentSummary.value.paymentType ) : '' );
</script>
