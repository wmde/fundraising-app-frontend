<template>
	<div class="membership-confirmation">
		<div class="donation-summary-wrapper has-background-bright columns has-padding-18">
			<div class="column is-two-thirds">
				<MembershipSummary
					:address="confirmationData.address"
					:membershipApplication="confirmationData.membershipApplication"
					:salutations="salutations"
					:address-is-invalid="false"
				>
					<template #title>
						<h1>{{ $t( 'membership_confirmation_thanks_text' ) }}</h1>
					</template>

					<template #content>
						<p v-if="hasIncentives">{{ $t( 'membership_confirmation_success_text_incentive' ) }}</p>
						<p v-else>{{ $t( 'membership_confirmation_success_text' ) }}</p>
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

<script setup lang="ts">
import MembershipSummary from '@src/components/shared/MembershipSummary.vue';
import SummaryLinks from '@src/components/pages/membership_confirmation/SummaryLinks.vue';
import MembershipConfirmationBannerNotifier
	from '@src/components/pages/membership_confirmation/MembershipConfirmationBannerNotifier.vue';
import { Salutation } from '@src/view_models/Salutation';
import { MembershipApplicationConfirmationData } from '@src/Domain/Membership/MembershipApplicationConfirmationData';

interface Props {
	confirmationData: MembershipApplicationConfirmationData;
	salutations: Salutation[];
}

const props = defineProps<Props>();
const hasIncentives = props.confirmationData.membershipApplication.incentives?.length > 0;
const showBankTransferContent = props.confirmationData.membershipApplication.paymentType === 'UEB';

</script>
