<template>
	<div class="donation-confirmation-card has-background-bright has-padding-18 mb-4">
		<div class="title is-size-5"><success-icon/> {{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</div>
		<payment-notice :payment="donation"></payment-notice>
		<div id="newsletter-optin" class="has-margin-top-18" v-if="donation.optsIntoNewsletter">
			{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import PaymentNotice from '@/components/pages/donation_confirmation/PaymentNotice.vue';
import { Donation } from '@/view_models/Donation';
import SuccessIcon from '@/components/shared/icons/SuccessIcon.vue';

export default Vue.extend( {
	name: 'SuccessMessage',
	components: {
		SuccessIcon,
		PaymentNotice,
	},
	props: {
		donation: Object as () => Donation,
	},
} );
</script>
