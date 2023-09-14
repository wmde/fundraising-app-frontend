<template>
	<div class="membership-cancellation-confirmation">
		<h1 class="title">{{ $t('membership_cancellation_title') }}</h1>
		<span v-html="$t( 'membership_cancellation_text_vuei18n_v3', { membership_id: cancellationData.membershipId, } )"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'MembershipCancellation',
	props: [
		'cancellationData',
	],
} );
</script>
