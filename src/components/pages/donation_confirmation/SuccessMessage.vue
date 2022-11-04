<template>
	<div class="donation-confirmation-card success-message has-background-bright mb-4">
		<h1 class="title icon-title"><success-icon/> {{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</h1>
		<div class="has-margin-top-18">
			<span v-html="donationSummaryMessage"></span> <span v-html="paymentNotice"></span>
		</div>
		<div id="newsletter-optin" class="has-margin-top-18" v-if="donation.optsIntoNewsletter">
			{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
		</div>
		<div class="has-margin-top-18">
			<a id="comment-link" @click="$emit( 'show-comment-modal' )" :disabled="commentLinkIsDisabled">
				{{ commentLinkIsDisabled ? $t( 'donation_comment_popup_thanks' ) : $t( 'donation_confirmation_comment_button' ) }}
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Donation } from '@/view_models/Donation';
import SuccessIcon from '@/components/shared/icons/SuccessIcon.vue';
import { TranslateResult } from 'vue-i18n';

export default Vue.extend( {
	name: 'SuccessMessage',
	components: {
		SuccessIcon,
	},
	props: {
		donation: Object as () => Donation,
		commentLinkIsDisabled: Boolean,
	},
	computed: {
		paymentNotice(): string|TranslateResult {
			if ( this.$props.donation.paymentType !== 'BEZ' ) {
				return '';
			}

			return this.$t( 'donation_confirmation_payment_direct_debit', {
				formattedAmount: this.$n( this.$props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
			} );
		},
		donationSummaryMessage(): string|TranslateResult {
			return this.$t( 'donation_confirmation_inline_summary', {
				interval: this.$t( 'donation_form_payment_interval_' + this.$props.donation.interval ),
				paymentType: this.$t( this.$props.donation.paymentType ),
				formattedAmount: this.$n( this.$props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
			} );
		},
	},
} );
</script>
