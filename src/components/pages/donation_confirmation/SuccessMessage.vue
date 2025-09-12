<template>
	<div class="donation-confirmation-card success-message">
		<IconText>
			<template #icon><SuccessIcon/></template>
			<template #content><h1>{{ $t( 'donation_confirmation_topbox_payment_title_alt' ) }}</h1></template>
		</IconText>
		<p>
			<span v-html="donationSummaryMessage"/> <span v-html="paymentNotice"/>
		</p>
		<p id="newsletter-box" v-if="donation.newsletter">
			{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
		</p>
		<p>
			<span class="comment-thanks" v-if="commentLinkIsDisabled">
				{{ $t( 'donation_comment_popup_thanks' ) }}
			</span>
			<a v-else
					id="comment-link"
					role="link"
					tabindex="0"
					@click="$emit( 'show-comment-modal' )"
					@keyup.enter.space="$emit( 'show-comment-modal' )"
			>
				{{ $t( 'donation_confirmation_comment_button' ) }}
			</a>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Donation } from '@src/view_models/Donation';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import IconText from '@src/components/patterns/IconText.vue';

export default defineComponent( {
	name: 'SuccessMessage',
	components: {
		IconText,
		SuccessIcon,
	},
	props: {
		donation: Object as () => Donation,
		commentLinkIsDisabled: Boolean,
	},
	computed: {
		paymentNotice(): String {
			if ( this.$props.donation.paymentType !== 'BEZ' ) {
				return '';
			}

			return this.$t( 'donation_confirmation_payment_direct_debit', {
				formattedAmount: this.$n( this.$props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
			} );
		},
		donationSummaryMessage(): String {
			if ( this.$props.donation.interval === 0 &&
				[ 'MCP', 'PPL', 'SUB' ].includes( this.$props.donation.paymentType )
			) {
				return this.$t( 'donation_confirmation_topbox_summary', {
					interval: this.$t( 'donation_form_payment_interval_' + this.$props.donation.interval ),
					formattedAmount: this.$n( this.$props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
					paymentType: this.$t( this.$props.donation.paymentType ),
				} );
			}
			return this.$t( 'donation_confirmation_inline_summary', {
				interval: this.$t( 'donation_form_payment_interval_' + this.$props.donation.interval ),
				paymentType: this.$t( this.$props.donation.paymentType ),
				formattedAmount: this.$n( this.$props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
			} );
		},
	},
} );
</script>
