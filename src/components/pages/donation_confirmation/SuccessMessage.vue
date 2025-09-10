<template>
	<ContentCard>
		<template #content>
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
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import ContentCard from '@src/components/patterns/ContentCard.vue';
import type { Donation } from '@src/view_models/Donation';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import IconText from '@src/components/patterns/IconText.vue';

interface Props {
	donation: Donation;
	commentLinkIsDisabled: boolean;
}

const props = defineProps<Props>();
const { t, n } = useI18n();

const paymentNotice = computed<string>( () => {
	if ( props.donation.paymentType !== 'BEZ' ) {
		return '';
	}

	return t( 'donation_confirmation_payment_direct_debit', {
		formattedAmount: n( props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
	} );
} );

const donationSummaryMessage = computed<string>( () => {
	if ( props.donation.interval === 0 &&
		[ 'MCP', 'PPL', 'SUB' ].includes( props.donation.paymentType )
	) {
		return t( 'donation_confirmation_topbox_summary', {
			interval: t( 'donation_form_payment_interval_' + props.donation.interval ),
			formattedAmount: n( props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
			paymentType: t( props.donation.paymentType ),
		} );
	}
	return t( 'donation_confirmation_inline_summary', {
		interval: t( 'donation_form_payment_interval_' + props.donation.interval ),
		paymentType: t( props.donation.paymentType ),
		formattedAmount: n( props.donation.amount, { key: 'currency', currencyDisplay: 'name' } ),
	} );
} );

</script>
