<template>
	<div class="membership-confirmation">
		<div class="donation-summary-wrapper has-background-bright columns has-padding-18">
			<div class="column is-half">
				<membership-summary
					:address="confirmationData.address"
					:membershipApplication="confirmationData.membershipApplication"
					:salutations="salutations"
				>
					<div class="has-margin-top-18" v-if="hasIncentives">{{ $t( 'membership_confirmation_success_text_incentive' ) }}</div>
					<div class="has-margin-top-18" v-if="!hasIncentives">{{ $t( 'membership_confirmation_success_text' ) }}</div>
					<div class="has-margin-top-18" v-if="showBankTransferContent">{{ $t( 'membership_confirmation_success_text_bank_transfer' ) }}</div>
				</membership-summary>
			</div>

			<div class="column is-half">
				<summary-links :confirmation-data="confirmationData"/>
			</div>
			<membership-confirmation-banner-notifier/>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import MembershipSummary from '@/components/shared/MembershipSummary.vue';
import SummaryLinks from '@/components/pages/membership_confirmation/SummaryLinks.vue';
import MembershipConfirmationBannerNotifier
	from '@/components/pages/membership_confirmation/MembershipConfirmationBannerNotifier.vue';

export default Vue.extend( {
	name: 'MembershipConfirmation',
	components: {
		MembershipConfirmationBannerNotifier,
		MembershipSummary,
		SummaryLinks,
	},
	props: [
		'confirmationData',
		'salutations',
	],
	computed: {
		hasIncentives(): boolean {
			return this.confirmationData.membershipApplication.incentives !== undefined
				&& this.confirmationData.membershipApplication.incentives.length > 0;
		},
		showBankTransferContent(): boolean {
			return this.$props.confirmationData.membershipApplication.paymentType === 'UEB';
		},
	},
} );
</script>
