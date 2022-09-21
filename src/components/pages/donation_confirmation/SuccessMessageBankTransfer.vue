<template>
	<div class="donation-confirmation-card has-background-bright has-padding-18 mb-4">
		<div class="columns is-multiline">
			<div class="column is-half">
				<div class="title is-size-5"><warning-icon/> {{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</div>
				<payment-notice :payment="donation"></payment-notice>
			</div>
			<div class="column is-half">
				<div id="bank-data">
					<bank-data :bank-transfer-code="donation.bankTransferCode"></bank-data>
					<div class="has-margin-top-18"
						v-html="$t( 'donation_confirmation_reminder_bank_transfer', { bankTransferCode: donation.bankTransferCode } )">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import PaymentNotice from '@/components/pages/donation_confirmation/PaymentNotice.vue';
import { Donation } from '@/view_models/Donation';
import BankData from '@/components/BankData.vue';
import WarningIcon from '@/components/shared/icons/WarningIcon.vue';

export default Vue.extend( {
	name: 'SuccessMessageBankTransfer',
	components: {
		WarningIcon,
		PaymentNotice,
		BankData,
	},
	props: {
		donation: Object as () => Donation,
	},
} );
</script>
