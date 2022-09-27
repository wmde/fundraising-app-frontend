<template>
	<div class="donation-confirmation-card success-message-bank-transfer has-background-bright has-padding-36 mb-4">
		<div class="columns is-multiline">
			<div class="column is-full">
				<h1 class="title icon-title"><warning-icon/> {{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</h1>
			</div>
			<div class="column is-half">
				<p>{{ donationSummaryMessage }}</p>
				<div class="has-margin-top-18"
					v-html="$t( 'donation_confirmation_reminder_bank_transfer', { bankTransferCode: donation.bankTransferCode } )">
				</div>
				<div id="newsletter-optin" class="has-margin-top-18" v-if="donation.optsIntoNewsletter">
					{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
				</div>
			</div>
			<div class="column is-half">
				<bank-data :bank-transfer-code="donation.bankTransferCode"></bank-data>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Donation } from '@/view_models/Donation';
import BankData from '@/components/BankData.vue';
import WarningIcon from '@/components/shared/icons/WarningIcon.vue';

export default Vue.extend( {
	name: 'SuccessMessageBankTransfer',
	components: {
		WarningIcon,
		BankData,
	},
	props: {
		donation: Object as () => Donation,
	},
	computed: {
		donationSummaryMessage: function () {
			return this.$t( 'donation_confirmation_payment_bank_transfer_alt', {
				formattedAmount: this.$n( this.$props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
			} );
		},
	},
} );
</script>

<style lang="scss">
.success-message-bank-transfer {
	.bank-data-content {
		background: #DDEDF6;
		padding: 1rem;
		display: inline-block;
	}
}
</style>
