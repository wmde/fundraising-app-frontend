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
				:language-item="inlineSummaryLanguageItem"
			/>
		</feature-toggle>
	</div>
</template>

<script lang="js">
import Vue from 'vue';
import DonationSummary from '@/components/shared/DonationSummary';
import { NS_ADDRESS } from '@/store/namespaces';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';

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
	computed: {
		inlineSummaryLanguageItem() {
			switch ( this.$store.state[ NS_ADDRESS ].addressType ) {
				case AddressTypeModel.ANON:
				case AddressTypeModel.UNSET:
					return 'donation_confirmation_inline_summary_anonymous';
				case AddressTypeModel.EMAIL:
					return 'donation_confirmation_inline_summary_email';
				case AddressTypeModel.COMPANY:
				case AddressTypeModel.PERSON:
				default:
					return 'donation_confirmation_inline_summary_address';
			}
		},
	}
} );
</script>
