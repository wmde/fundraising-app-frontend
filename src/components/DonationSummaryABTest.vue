<template>
	<div class="donation-summary">
		<feature-toggle>
			<donation-summary
				slot="campaigns.confirmation_page_layout.old_layout"
				:payment="payment"
				:address-type="addressType"
				:address="address"
				:countries="countries"
				:language-item="'donation_confirmation_topbox_summary'"
			/>
			<donation-summary
				slot="campaigns.confirmation_page_layout.new_layout"
				:payment="payment"
				:address-type="addressType"
				:address="address"
				:countries="countries"
				:language-item="'donation_confirmation_topbox_summary_alt'"
			/>
		</feature-toggle>
	</div>
</template>

<script lang="js">
import Vue from 'vue';
import DonationSummary from '@/components/shared/DonationSummary';

export default Vue.extend( {
	name: 'DonationSummaryABTest',
	props: [
		'address',
		'addressType',
		'payment',
		'countries',
	],
	components: {
		DonationSummary,
	},
} );
</script>
