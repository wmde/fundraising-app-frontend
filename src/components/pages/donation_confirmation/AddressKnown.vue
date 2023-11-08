<template>
	<div class="donation-confirmation-card known-address">
		<h2 class="icon-title">
			<SuccessIcon/>
			{{ donation.optsIntoDonationReceipt === true ?
				$t( 'donation_confirmation_summary_title' ) :
				$t( 'donation_confirmation_summary_title_no_receipt_wanted' )
			}}
		</h2>

		<div class="address-summary">
			<p v-if="addressType === 'person'" v-html="$t( 'donation_confirmation_address_person', {
				salutation: salutation,
				fullName: address.fullName,
				streetAddress: address.street,
				postalCode: address.postcode,
				city: address.city,
				country: country
			} )"></p>
			<p v-else v-html="$t( 'donation_confirmation_address_company', {
				fullName: address.fullName,
				streetAddress: address.street,
				postalCode: address.postcode,
				city: address.city,
				country: country
			} )"></p>
		</div>
		<div class="payment-email" v-html="$t( 'donation_confirmation_email', { email: this.$props.address.email } )"></div>
		<div>{{ $t( 'donation_confirmation_address_update' ) }}
			<a href="#" id="update-address-link" @click="$emit( 'show-address-modal' )">{{ $t( 'donation_confirmation_address_update_link' ) }}</a>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Donation } from '@src/view_models/Donation';
import { Country } from '@src/view_models/Country';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import { TranslateResult } from 'vue-i18n';
import { Address } from '@src/view_models/Address';
import { Salutation } from '@src/view_models/Salutation';

export default defineComponent( {
	name: 'AddressKnown',
	components: {
		SuccessIcon,
	},
	data: function () {
		return {
			countryCode: this.$props.address.country,
		};
	},
	props: {
		donation: Object as () => Donation,
		address: Object as () => Address,
		addressType: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
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
			return this.$props.salutations.find( ( salutation: Salutation ) => salutation.label === this.address.salutation )?.display;
		},
	},
} );
</script>
