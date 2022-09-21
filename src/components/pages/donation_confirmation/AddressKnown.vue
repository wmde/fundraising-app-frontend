<template>
	<div class="donation-confirmation-card has-background-bright has-padding-36 mb-4">
		<div class="donation-summary-intro">
			<div><success-icon/> <strong>{{ $t( 'donation_confirmation_summary_title_alt' ) }}</strong></div>
		</div>
		<div class="address-summary">
			<p v-html="addressString()"></p>
		</div>
		<div class="payment-email" v-html="getEmail()"></div>
		<a href="#" @click="$emit( 'show-address-modal' )">{{ $t( 'donation_confirmation_address_update_link' ) }}</a>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Donation } from '@/view_models/Donation';
import { Country } from '@/view_models/Country';
import { Salutation } from '@/view_models/Salutation';
import SuccessIcon from '@/components/shared/icons/SuccessIcon.vue';
import { LocaleMessage } from 'vue-i18n';

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
		salutations: Array as () => Array<Salutation>,
	},
	computed: {
		country: function () {
			const countryObject = this.countries.find( c => ( c.countryCode === this.countryCode || c.countryCode === this.countryCode ) );
			return countryObject ? countryObject.countryFullName : '';
		},
	},
	methods: {
		getEmail: function (): LocaleMessage {
			if ( this.$props.addressType === 'anonym' ) {
				return '';
			}
			if ( this.$props.address.email ) {
				return this.$t( 'donation_confirmation_topbox_email', { email: this.$props.address.email } );
			}
			return this.$t( 'donation_confirmation_review_email_missing' );
		},
		salutationDisplay: function (): string {
			if ( !this.$props.address.salutation || this.$props.address.salutation === '' ) {
				return '';
			}
			return this.$props.address.salutation + ' ';
		},
		addressString: function (): LocaleMessage {
			if ( !this.canRenderAddress() ) {
				return this.$t( 'donation_confirmation_review_address_missing' );
			}
			return [
				this.salutationDisplay() + this.$props.address.fullName,
				this.$props.address.streetAddress,
				this.$props.address.postalCode + ' ' + this.$props.address.city,
				this.$props.country,
			].join( ', ' );
		},
		canRenderAddress: function (): Boolean {
			return this.$props.address.salutation
				&& this.$props.address.firstName
				&& this.$props.address.lastName
				&& this.$props.address.streetAddress
				&& this.$props.address.postalCode
				&& this.$props.address.city;
		},
	},
} );
</script>
