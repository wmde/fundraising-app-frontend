<template>
	<div class="donation-confirmation-card success-bank-transfer has-background-bright has-padding-18 mb-4">
		<div class="columns is-multiline">
			<div class="column is-half">
				<h1 class="title icon-title"><warning-icon/> {{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</h1>
				<p>{{ $t( 'donation_confirmation_payment_bank_transfer_alt', {
					formattedAmount: this.$n( donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
				} ) }}</p>
				<div class="has-margin-top-18"
					v-html="$t( 'donation_confirmation_reminder_bank_transfer', { bankTransferCode: donation.bankTransferCode } )">
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
} );
</script>

<style lang="scss">
.success-bank-transfer {
	.bank-data-content {
		background: #DDEDF6;
		padding: 1rem;
		float: left;
	}
}
</style>
