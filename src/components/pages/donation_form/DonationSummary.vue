<template>
	<div class="form-summary-content">
		<p>
			{{ formattedAmount }}
			<span v-if="interval"> {{ interval }}</span>
			<span v-if="paymentType"> {{ $t('donation_summary_via') }} {{ paymentType }}</span>
		</p>

		<DonorSummary :address="address" :countries="countries" :salutations="salutations" />
	</div>
</template>

<script setup lang="ts">
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import DonorSummary from '@src/components/pages/donation_form/DonorSummary.vue';

interface Props {
	address: Record<string, string>;
	addressType: String;
	payment: { interval: any; amount: number; paymentType: any };
	countries: Array<Country>;
	languageItem: String;
	salutations: Array<Salutation>;
}

const { t, n } = useI18n();
const props = defineProps<Props>();

const formattedAmount = computed( () => n( props.payment.amount, { key: 'currency', currencyDisplay: 'name' } ) );

const interval = computed( () => props.payment.interval ? t( 'donation_form_payment_interval_' + props.payment.interval ) : '' );

const paymentType = computed( () => props.payment.paymentType ? t( props.payment.paymentType ) : '' );

</script>
