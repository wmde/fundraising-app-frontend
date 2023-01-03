<template>
	<div class="donation-confirmation-card known-address has-background-bright mb-4">
		<h2 class="icon-title is-size-5 has-margin-bottom-18">
			<success-icon/>
			{{ donation.optsIntoDonationReceipt === true ?
				$t( 'donation_confirmation_summary_title' ) :
				$t( 'donation_confirmation_summary_title_no_receipt_wanted' )
			}}
		</h2>

		<div class="address-summary">
			<p v-if="addressType === 'person'" v-html="$t( 'donation_confirmation_address_person', {
				salutation: salutation,
				fullName: address.fullName,
				streetAddress: address.streetAddress,
				postalCode: address.postalCode,
				city: address.city,
				country: country
			} )"></p>
			<p v-else v-html="$t( 'donation_confirmation_address_company', {
				fullName: address.fullName,
				streetAddress: address.streetAddress,
				postalCode: address.postalCode,
				city: address.city,
				country: country
			} )"></p>
		</div>
		<div class="payment-email has-margin-bottom-18" v-html="$t( 'donation_confirmation_email', { email: this.$props.address.email } )"></div>
		<div>{{ $t( 'donation_confirmation_address_update' ) }}
			<a href="#" id="update-address-link" @click="$emit( 'show-address-modal' )">{{ $t( 'donation_confirmation_address_update_link' ) }}</a>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Donation } from '@/view_models/Donation';
import { Country } from '@/view_models/Country';
import SuccessIcon from '@/components/shared/icons/SuccessIcon.vue';
import { TranslateResult } from 'vue-i18n';

export default Vue.extend( {
	name: 'AddressKnown',
	components: {
		SuccessIcon,
	},
	data: function () {
		return {
			countryCode: this.$props.address.countryCode,
		};
	},
	props: {
		donation: Object as () => Donation,
		address: Object,
		addressType: String,
		countries: Array as () => Array<Country>,
	},
	computed: {
		country: function (): string {
			const countryObject = this.countries.find( c => ( c.countryCode === this.countryCode || c.countryCode === this.countryCode ) );
			return countryObject ? countryObject.countryFullName : '';
		},
		salutation: function (): string|TranslateResult {
			if ( !this.$props.address.salutation || this.$props.address.salutation === '' ) {
				return '';
			}
			return this.$props.address.salutation + ' ';
		},
	},
} );
</script>
