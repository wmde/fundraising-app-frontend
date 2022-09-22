<template>
	<div class="donation-confirmation-card has-background-bright has-padding-18 mb-4">
		<h1 class="title icon-title"><success-icon/> {{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</h1>
		<payment-notice :payment="donation"></payment-notice>
		<div id="newsletter-optin" class="has-margin-top-18" v-if="donation.optsIntoNewsletter">
			{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
		</div>
		<div class="has-margin-top-18">
			<a id="comment-link" @click="$emit( 'show-comment-modal' )" v-if="donationCanBeCommented" :disabled="commentLinkIsDisabled">
				{{ commentLinkIsDisabled ? $t( 'donation_comment_popup_thanks' ) : $t( 'donation_confirmation_comment_button' ) }}
			</a>
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
		commentLinkIsDisabled: Boolean,
	},
	computed: {
		donationCanBeCommented(): boolean {
			return this.$props.donation.paymentType !== 'UEB';
		},
	},
} );
</script>
