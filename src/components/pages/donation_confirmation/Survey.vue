<template>
	<div class="donation-confirmation-card has-background-bright has-padding-18 mb-4">
		<p class="has-margin-bottom-18"><donor-icon/> <strong>{{ $t( 'donation_confirmation_survey_title' ) }}</strong></p>
		<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_survey_content' ) }}</p>
		<p><a href="#">{{ $t( 'donation_confirmation_survey_link' ) }}</a></p>
	</div>
</template>

<script setup lang="ts">
import DonorIcon from '@src/components/shared/icons/DonorIcon.vue';
</script>
