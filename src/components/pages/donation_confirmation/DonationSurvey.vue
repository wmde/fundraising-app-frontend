<template>
	<div class="donation-confirmation-card">
		<h2 class="icon-title"><donor-icon/> {{ $t( 'donation_confirmation_survey_title' ) }}</h2>
		<p>{{ $t( 'donation_confirmation_survey_content' ) }}</p>
		<p>{{ $t( 'donation_confirmation_survey_link_text' ) }}</p>
		<p><a :href="$t( 'donation_confirmation_survey_link' )">{{ $t( 'donation_confirmation_survey_link' ) }}</a></p>
	</div>
</template>

<script setup lang="ts">
import DonorIcon from '@src/components/shared/icons/DonorIcon.vue';
</script>
