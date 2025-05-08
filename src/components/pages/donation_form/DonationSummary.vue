<template>
	<div class="form-summary-content" aria-live="polite">
		<h3 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_summary_title' ) }}</h3>
		<p> {{ $t( 'donation_form_payment_headline' ) }}
			{{ formattedAmount }}
			<template v-if="interval"> {{ interval }}</template>
			<template v-if="paymentType"> {{ $t('donation_summary_via') }} {{ paymentType }}</template>
		</p>
		<div class="switcher">
			<div>
				<DonorSummary :address="address" :countries="countries" :salutations="salutations" />
			</div>
			<div v-if="bankData.iban">
				<h4>{{ $t('donation_form_summary_bank_details') }}</h4>
				<strong>{{ $t('donation_form_summary_iban') }}</strong> {{ bankData.iban }}<br>
				<strong>{{ $t('donation_form_summary_bic') }}</strong> {{ bankData.bic }}<br>
				<strong>{{ $t('donation_form_summary_bank_name') }}</strong> {{ bankData.bankName }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import DonorSummary from '@src/components/pages/donation_form/DonorSummary.vue';
import { Address } from '@src/view_models/Address';

interface Props {
	address: Address;
	payment: { interval: any; amount: number; paymentType: any };
	bankData: { iban: string; bic: string; bankName: string };
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
	flex-basis: calc((40rem - 100%) * 999);
}
</style>
