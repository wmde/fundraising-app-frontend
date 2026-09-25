<template>
	<ContentCard>
		<template #content>
			<IconText>
				<template #icon><WarningIcon/></template>
				<template #content><h1>{{ $t( 'donation_confirmation_topbox_payment_title_bank_transfer_alt' ) }}</h1></template>
			</IconText>
			<div class="switcher">
				<Callout :is-borderless="true" class="flow">
					<h2> {{ $t( 'donation_confirmation_payment_bank_transfer_details' ) }} </h2>
					<BankData :bank-transfer-code="donation.bankTransferCode" :bank-transfer-amount="formattedAmount" />
				</Callout>
				<div class="flow">
					<p>{{ donationSummaryMessage }}</p>
					<p v-html="$t( 'donation_confirmation_reminder_bank_transfer', { bankTransferCode: donation.bankTransferCode } )"></p>
					<p id="newsletter-box" v-if="donation.newsletter">
						{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
					</p>
				</div>
			</div>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Donation } from '@src/view_models/Donation';
import BankData from '@src/components/shared/BankData.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import { useI18n } from 'vue-i18n';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import Callout from '@src/components/patterns/Callout.vue';

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
