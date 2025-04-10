<template>
	<div class="donation-confirmation-card donation-survey">
		<h2 class="icon-title"><donor-icon/> {{ $t( 'donation_confirmation_survey_title' ) }}</h2>
		<p>{{ $t( 'donation_confirmation_survey_content' ) }}</p>
		<p><a target="_blank" :href="$t( 'donation_confirmation_survey_link', { tracking: tracking } )">{{ $t( 'donation_confirmation_survey_link_text' ) }} <ExternalLink/></a></p>
	</div>
</template>

<script setup lang="ts">
import DonorIcon from '@src/components/shared/icons/DonorIcon.vue';
import ExternalLink from '@src/components/shared/icons/ExternalLink.vue';

interface Props {
	tracking: string;
}

defineProps<Props>();

</script>
