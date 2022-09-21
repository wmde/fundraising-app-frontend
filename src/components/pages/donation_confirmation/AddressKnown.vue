<template>
	<div class="donation-confirmation-card has-background-bright has-padding-18 mb-4">
		<div class="donation-summary-intro">
			<div><success-icon/> <strong>{{ $t( 'donation_confirmation_summary_title_alt' ) }}</strong></div>
		</div>
		<div class="donation-summary">
			<donation-summary
				:address="address"
				:address-type="addressType"
				:payment="donation"
				:countries="countries"
				:salutations="salutations"
				:language-item="donationSummaryLanguageItem"
			/>
		</div>
		<div class="payment-email" v-html="getEmail()"></div>
		<a href="#" @click="$emit( 'show-address-modal' )">{{ $t( 'donation_confirmation_address_update_link' ) }}</a>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import DonationSummary from '@/components/shared/DonationSummary.vue';
import { Donation } from '@/view_models/Donation';
import { Country } from '@/view_models/Country';
import { Salutation } from '@/view_models/Salutation';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import SuccessIcon from '@/components/shared/icons/SuccessIcon.vue';

export default Vue.extend( {
	name: 'AddressKnown',
	components: {
		SuccessIcon,
		DonationSummary,
	},
	props: {
		donation: Object as () => Donation,
		address: Object,
		addressType: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
	},
	computed: {
		donationSummaryLanguageItem: function () {
			switch ( this.$props.addressType ) {
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
	},
	methods: {
		getEmail: function () {
			if ( this.$props.addressType === 'anonym' ) {
				return '';
			}
			if ( this.$props.address.email ) {
				return this.$t( 'donation_confirmation_topbox_email', { email: this.$props.address.email } );
			}
			return this.$t( 'donation_confirmation_review_email_missing' );
		},
	},
} );
</script>
