<template>
	<div class="form-summary-content" aria-live="polite">
		<h2 class="summary-title">{{ $t( 'donation_form_summary_title' ) }}</h2>
		<p class="summary-text"> {{ $t( 'donation_form_summary_headline' ) }}
			{{ formattedAmount }}
			<template v-if="interval"> {{ interval }}</template>
			<template v-if="paymentType"> {{ $t('donation_summary_via') }} {{ paymentType }}</template>
		</p>
		<div class="switcher" :class="{ 'no-contact': !address }">
			<div>
				<DonorSummary
					v-if="address"
					:address="address"
					:countries="countries"
					:salutations="salutations"
				/>
			</div>
			<div v-if="bankData" class="bank">
				<h3 class="summary-title">{{ $t('donation_form_summary_bank_details') }}</h3>
				<strong>{{ $t('donation_form_summary_iban') }}</strong> {{ bankData.iban }}<br>
				<strong v-if="bankData.bic">{{ $t('donation_form_summary_bic') }}</strong> {{ bankData.bic }}<br>
				<strong v-if="bankData.bankName">{{ $t('donation_form_summary_bank_name') }}</strong> {{ bankData.bankName }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import DonorSummary from '@src/components/pages/donation_form/DonorSummary.vue';
import type { Address } from '@src/view_models/Address';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';

interface Props {
	address: Address | undefined;
	payment: { interval: any; amount: number; paymentType: any };
	bankData: { iban: string; bic: string; bankName: string } | undefined;
	countries: Array<Country>;
	salutations: Array<Salutation>;
}

const { t, n } = useI18n();
const props = defineProps<Props>();

const formattedAmount = computed( () => n( props.payment.amount, { key: 'currency', currencyDisplay: 'name' } ) );

const interval = computed( () => props.payment.interval ? t( 'donation_form_payment_interval_' + props.payment.interval ) : '' );

const paymentType = computed( () => props.payment.paymentType ? t( props.payment.paymentType ) : '' );
</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.switcher {
	display: flex;
	flex-wrap: wrap;
	gap: map.get( units.$spacing, 'small' );
}

.switcher > * {
	flex-grow: 1;
	flex-basis: calc((26rem - 100%) * 999);
}

.switcher.no-contact > div.bank {
	flex-basis: 100%;
}
</style>
