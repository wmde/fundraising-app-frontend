<template>
	<div class="donation-cancellation-confirmation">
		<h1 class="title">{{ $t('donation_cancellation_title') }}</h1>
		<span v-html="$t( 'donation_cancellation_text_vuei18n_v3', { donation_id: cancellationData.donationId, } )"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'DonationCancellation',
	props: [
		'cancellationData',
	],
} );
</script>
