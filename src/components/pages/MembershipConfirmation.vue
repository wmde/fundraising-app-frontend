<template>
	<div class="membership-confirmation">
		<div class="donation-summary-wrapper has-background-bright columns has-padding-18">
			<div class="column is-two-thirds">
				<MembershipSummary
					:address="confirmationData.address"
					:membershipApplication="confirmationData.membershipApplication"
					:salutations="salutations"
				>
					<template #title>
						<h1>{{ $t( 'membership_confirmation_thanks_text' ) }}</h1>
					</template>

					<template #content>
						<p v-if="hasIncentives">{{ $t( 'membership_confirmation_success_text_incentive' ) }}</p>
						<p v-if="!hasIncentives">{{ $t( 'membership_confirmation_success_text' ) }}</p>
						<p v-if="showBankTransferContent">{{ $t( 'membership_confirmation_success_text_bank_transfer' ) }}</p>
					</template>
				</MembershipSummary>
			</div>

			<div class="column is-one-third">
				<SummaryLinks :confirmation-data="confirmationData"/>
			</div>
			<MembershipConfirmationBannerNotifier/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MembershipSummary from '@src/components/shared/MembershipSummary.vue';
import SummaryLinks from '@src/components/pages/membership_confirmation/SummaryLinks.vue';
import MembershipConfirmationBannerNotifier
	from '@src/components/pages/membership_confirmation/MembershipConfirmationBannerNotifier.vue';

export default defineComponent( {
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
