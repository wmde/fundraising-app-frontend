<template>
	<div class="donation-confirmation-card success-message-bank-transfer">
		<div class="columns is-multiline pt-0 pb-0 mt-0 mb-0">
			<div class="column is-full pt-0 pb-0 mt-0 mb-0">
				<h1 class="icon-title"><WarningIcon /> {{ $t( 'donation_confirmation_topbox_payment_title_bank_transfer_alt' ) }}</h1>
			</div>
			<div class="column is-half pt-0 pb-0">
				<div class="bank-data-content">
					<h2> {{ $t( 'donation_confirmation_payment_bank_transfer_details' ) }} </h2>
					<BankData :bank-transfer-code="donation.bankTransferCode" :bank-transfer-amount="formattedAmount" />
				</div>
			</div>
			<div class="column is-half pt-0 pb-0 mt-0 mb-0">
				<p>{{ donationSummaryMessage }}</p>
				<p v-html="$t( 'donation_confirmation_reminder_bank_transfer', { bankTransferCode: donation.bankTransferCode } )"></p>
				<p id="newsletter-box" v-if="donation.newsletter">
					{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Donation } from '@src/view_models/Donation';
import BankData from '@src/components/shared/BankData.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import { useI18n } from 'vue-i18n';

interface Props {
	donation: Donation;
}

const props = defineProps<Props>();
const { t, n } = useI18n();

const formattedAmount = n( props.donation.amount, { key: 'currency', currencyDisplay: 'name' } );

const donationSummaryMessage = computed<String>( () => {
	return t( 'donation_confirmation_payment_bank_transfer', {
		formattedAmount,
		interval: t( 'donation_confirmation_bank_transfer_interval_' + props.donation.interval ),
	} );
} );

</script>

<style lang="scss">
@use 'src/scss/settings/units';
@use 'sass:map';

.success-message-bank-transfer {
	.bank-data-content {
		background: #DDEDF6;
		padding: 1rem;
		width: 100%;
	}

	.bank-data-list {
		list-style-type: none;
		padding-left: 0;
	}

	p:last-child {
		margin-bottom: map.get( units.$spacing, 'small' );
	}
}
</style>
